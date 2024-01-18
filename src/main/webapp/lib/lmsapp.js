var lmsapp = angular.module("lmsapp", ["ngCookies"]);

lmsapp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = true;
}])

lmsapp.config(['$qProvider', function($qProvider) {
	$qProvider.errorOnUnhandledRejections(false);
}]);

lmsapp.controller("basectrl", ["$scope", "$http", "$location", "$rootScope", function($scope, $http, $location, $rootScope) {
	$rootScope.APIURL = "http://localhost:8080/lmsapp/rest";//"http://202.21.32.165:8980/lmsapp/rest";//
	$rootScope.SITEURL = "http://localhost:8080/lmsapp";//"http://202.21.32.165:8980/lmsapp/";//
	$scope.welcome = "Welcome to lmsapp";
	$scope.islogin = getCookie("islogin");
	//GET Server Call
	var getServerCall = function(url, callback) {
		$http.get(url, { withCredentials: false, headers: $rootScope.header }).then(function(response) {
			callback && callback(response.data);
		});
	}

	//POST Server Call
	var postServerCall = function(inputdata, url, callback) {
		$http.post(url, inputdata).then(function(response) {
			callback && callback(response.data);
		});
	}
	
	//POST Server Call
	var postImageServerCall = function(inputdata, url, callback) {
		$('#loading').modal('show');
		$http.post(url, inputdata, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response) {
			callback && callback(response.data);
			$('#loading').modal('hide');
		});

	}
	
	$scope.login = function(username, password){
		var request = {username:username,password:password}
		postServerCall(request, $rootScope.APIURL + "/login", function(response) {
			console.log(response);
			setCookie("islogin", "success");
			window.open($rootScope.SITEURL, "_self");
		})
	}
	
	$scope.logout = function(){
		setCookie("islogin", "");
		window.open($rootScope.SITEURL, "_self");
	}
	
	$scope.signupPage = false;
	$scope.signupClick = function(){
		$scope.signupPage = true;
	}
	
	$scope.signup = function(username, mobile, usertype, password, cpassword){
		var request = {emailid:username, phone:mobile, password:password, type:usertype};
		postServerCall(request, $rootScope.APIURL + "/signup", function(response) {
			console.log(response);
			alert(response.message);
			if(response.status){
				$scope.signupPage = false;
			}
		})
	}
	
	$scope.uploadFile = function(element) {
		var reader = new FileReader();
		var filename = $(element)[0].files[0].name;
		const parts = filename.split(".");
		const nameWithoutExtension = parts[0];
		if(/[^a-zA-Z0-9_-]/.test(nameWithoutExtension)){
			generateAlert1(false, "Filename should contain characters and numbers!");
		}else{
			reader.readAsDataURL($(element)[0].files[0]);
			reader.onload = function() {
				var imgData = reader.result;
				//var size = document.getElementById("fileInput2").files[0].size / 1024;
				
				var imageFile = dataURLtoFile(imgData, filename);
				var formdata = new FormData();
				formdata.append("file", imageFile);
				var uploadUrl =  $rootScope.APIURL + "/uploadFile";
				postImageServerCall(formdata, uploadUrl, function(response) {
					if(response=="success"){
						alert("success");
					}else{
						alert("failed");
					}
				})
				
			};
			reader.onerror = function(error) {
				console.log('Error: ', error);
			};
		}
	}
	
	$scope.institutes = [{name:"ABC", created:"1 Jan 2024", status:"Active"},
		{name:"XYZ", created:"1 Jan 2024", status:"Active"},
		{name:"LMN", created:"1 Jan 2024", status:"Active"}
	];
	
	$scope.selectedInstitute = undefined;
	$scope.selectInstitute = function(inst){
		$scope.selectedInstitute = inst;
	}
	
	$scope.addInstituteClicked = false;
	$scope.addInstitute = function(){
		$scope.addInstituteClicked = true;
	}
	
	$scope.createInstitute = function(instName, email, phone){
		var req = {name:instName, emailid:email, phone:phone, usertype:"ADMIN"};
		postServerCall(req, $rootScope.APIURL + "/createAdmin", function(response) {
			console.log(response);
		})
	}
	
}]);
