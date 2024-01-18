var marketplace = angular.module("marketplace", ["ngCookies"]);

marketplace.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.withCredentials = true;
}])

marketplace.config(['$qProvider', function($qProvider) {
	$qProvider.errorOnUnhandledRejections(false);
}]);
var generateAlert = function($rootScope, alert, alertMsg) {
	$rootScope.alertMessage.alert = alert;
	$rootScope.alertMessage.message = alertMsg;
	$('#successAlert').modal('show');
	setTimeout(function() {
		$('#successAlert').modal('hide');
	}, 2000);
}

marketplace.filter('myfilter', function () {
    return function (items, cat, categories) {
        var filtered = [];
        for (var i in items) {
            if ((cat.showAll == true)){
                filtered.push(items[i]);
            }                
            else {
				categories.forEach(function(category) {
					if(cat[category.name] == true && items[i].category == category.name){
						filtered.push(items[i]);
					}
				});
			}
        }

        return filtered;
    };
});

marketplace.filter('greaterThan', function () {
    return function (items) {
        var filtered = [];
        for (var i in items)
        {
			if(items[i].no_of_items > 0){
				filtered.push(items[i]);
			}
        }
        return filtered;
    };
});	

marketplace.controller("basectrl", ["$scope", "$http", "$location", "$rootScope", function($scope, $http, $location, $rootScope) {
	$rootScope.APIURL = "http://localhost:9090/marketplace/rest";//"http://202.21.32.165:8980/marketplace/rest";//
	$rootScope.SITEURL = "http://localhost:9090/marketplace";//"http://202.21.32.165:8980/marketplace/";//
	//get cookie code 
	$scope.islogin = getCookie("islogin");
	$scope.image = getCookie("image");
	$scope.userType = getCookie("userType");
	$scope.email = getCookie("email");
	var userInfo = getCookie("userInfo");
	if(userInfo!=""){
		$scope.userInfo = JSON.parse(getCookie("userInfo"));
	}
	$scope.name = getCookie("name");
	//$scope.islogout = getCookie("islogout");
	if ($scope.islogin == "undefined" || $scope.islogin == "") {
		$scope.viewPage = "LOGIN";
	}
	else {
		$scope.viewPage = "HOME";
	}
	
	$scope.buyProduct = function(product) {
		$scope.selectedProduct = product;
		$scope.viewCustomerPage = "BUYPRODUCT";
	}
	
	$scope.orderProduct = function() {
		var userId = getCookie("_id");
		$scope.selectedProduct.userId = userId;
		postServerCall($scope.selectedProduct, $rootScope.APIURL + "/orderProduct", function(response) {
			console.log(response);
			if (response == "true") {
				$(".orderproduct-response").text("Successfully Ordered!! An email has been sent.");
			} else {
				$(".orderproduct-response").text("Order failed. Please re-check");
			}
			window.open("http://localhost:8080/marketplace", "_self");
		})
	}
	
	$scope.welcome = "Welcome to FiduciaAI";
	//$rootScope.siteURL = urlConfiguration.siteURL;
	$rootScope.siteURL = $location.absUrl();
    $rootScope.alertMessage = {};
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

	$scope.menuClick = function(menu) {
		$scope.selectedMenu = menu;
		if (menu == "vote") {
			$scope.viewPage = "HOME";
		}
	}

	$scope.loginClick = function(page) {
		$scope.viewPage = page;
	}

	$scope.signupClick = function(signup) {
		$scope.viewPage = signup;
	}

	$scope.viewHtmlPage = function(page) {
		$scope.viewPage = page;
	}
	$scope.sendOtp = function(otp) {
		$scope.viewPage = otp;
	}
	$scope.resetPassword = function(resetPassword) {
		$scope.viewPage = resetPassword;
	}

	$scope.priceByUnit = function(unit) {
		$scope.priceBy = "UNIT";
	}

	$scope.priceByVolume = function(volume) {
		$scope.priceBy = "VOLUME";
	}

	$scope.backToProducts = function() {
		$scope.viewPage = "CUSTOMER_CONTENT";
	}
	
	$scope.refresh = function() {
		window.open($rootScope.SITEURL, "_self");
	}
	
	//logout
	$scope.logout = function(email, password) {
		setCookie("islogin", undefined);
		//setCookie("email", email);
		//setCookie("password", password)

		$scope.reload = location.reload();

	}
	$scope.createUserData = [];
	$scope.createUserData.image = "";

	$scope.uploadUserImage = function(element, action) {
		var reader = new FileReader();
		reader.readAsDataURL($(element)[0].files[0]);
		reader.onload = function() {
			var image = reader.result;
			var size = document.getElementById("userImageUpload").files[0].size / 1024;

			if (action == "userImage") {
				if (size <= 500) {
					$scope.createUserData.image = image;
					$scope.userInfo.image = $scope.createUserData.image;
					displayUserImages();
				}
			}
		};
		reader.onerror = function(error) {
			console.log('Error: ', error);
		};
	};
	
	function displayUserImages() {
		var imgUserContainer = $('#userImageDisplay');
		imgUserContainer.empty();

		console.log($scope.createUserData.image);
		var img = $('<img>').attr('src', $scope.createUserData.image).css('width', '100px');
		imgUserContainer.append(img);
	}

	$scope.saveAddress = function() {
		if($scope.image!='undefined'&&$scope.image!=null&&$scope.image!=''){
			$scope.userInfo.image = $scope.image;
		}
		$scope.userInfo.name = $('#name').text();
		$scope.userInfo.mobile = $('#phn').text();
		$scope.userInfo.address = $('#address').text();
		postServerCall($scope.userInfo, $rootScope.APIURL + "/updateUserInfo", function(response) {
				console.log(response);
				setCookie("image", response.image);
				response.image = "";
				var info = JSON.stringify(response);
				setCookie("userInfo", info);
				window.open($rootScope.SITEURL, "_self");
		});
    };
    
    $scope.viewOrderProduct = function(product) {
		$scope.viewPage = "PRODUCT_VIEW";
		$scope.selectedProduct = product;
		$scope.selectedProductImages = product.image;
		console.log($scope.selectedProductImages);
		$scope.getUserVotes($scope.selectedProduct);
		$scope.getProductVotes($scope.selectedProduct);

	}
	
	$scope.vendorSignUpData = {};
	$scope.registerVendor = function() {
		var flag = validateVendor($scope.vendorSignUpData);
        if (!flag) {
            return 0;
        }
		$scope.vendorSignUpData.userType = "VENDOR";
		postServerCall($scope.vendorSignUpData, $rootScope.APIURL + "/signUp", function(response) {
			console.log(response);
			if (response == "true") {
				$(".signup-response").text("Successfully Registered!! An email has been sent.");
			} else {
				$(".signup-response").text("Registration failed. Please re-check");
			}
		})
	}

	$scope.userSignUpData = {};
	$scope.registerUser = function() {
		var flag = validateUser($scope.userSignUpData);
        if (!flag) {
            return 0;
        }
		$scope.userSignUpData.userType = "USER";
		postServerCall($scope.userSignUpData, $rootScope.APIURL + "/signUp", function(response) {
			console.log(response);
			if (response == "true") {
				$(".signup-response").text("Successfully Registered!! An email has been sent.");
			} else {
				$(".signup-response").text("Registration failed. Please re-check");
			}
		})
	}
	
	$scope.userSignInData = {};
	$scope.userLogin = function() {
		//$scope.userSignInData.userType = "USER";
		postServerCall($scope.userSignInData, $rootScope.APIURL + "/signIn", function(response) {
			console.log(response);
			//$rootScope.loginType = response.userType;
			console.log($scope.loginType);
			if (response.email != undefined) {
				//$(".login-response").text("Successfully Registered!! An email has been sent.");
				setCookie("islogin", true);
				setCookie("email", $scope.userSignInData.email);
				setCookie("userType", response.userType);
				setCookie("_id", response._id);
				setCookie("name", response.name);
				response.image = "";
				var info = JSON.stringify(response);
				setCookie("userInfo", info);
				window.open($rootScope.SITEURL, "_self");
			} else {
				$(".login-response").text("Invalid credentials");
			}
		})
	}

	/*$scope.productCollection = {};
	$scope.createProduct = function() {
		$scope.productCollection.userId = $rootScope.userInfo._id;
		postServerCall($scope.productCollection, $rootScope.APIURL+"/productCollection", function(response) {
			console.log(response);
			if (response == "true") {
				$(".newproduct-response").text("Successfully Registered!! An email has been sent.");
			} else {
				$(".newproduct-response").text("Registration failed. Please re-check");
			}
		})
	}*/

	$scope.forgotPasswordData = {};
	$scope.sendOtp = function() {
		$scope.currentEmail = $scope.forgotPasswordData.email;
		postServerCall($scope.forgotPasswordData, $rootScope.APIURL + "/forgotPassword", function(response) {
			console.log(response);
			if (response == "true") {
				$scope.viewHtmlPage('OTP');

			}

		})
	}

	$scope.otpData = {};
	$scope.validateOtp = function() {
		$scope.otpData.email = $scope.currentEmail;
		console.log($scope.otpData);
		postServerCall($scope.otpData, $rootScope.APIURL + "/validateOtp", function(response) {
			console.log(response);
			if (response == "true") {
				//alert("otp validated");
				$scope.viewHtmlPage('RESET_PWD');
			} else {
				alert("otp invalid");
			}
		})
	}

	$scope.resetPasswordData = {};
	$scope.resetPassword = function() {
		if ($scope.resetPasswordData.password != $scope.resetPasswordData.confirmPassword) {
			alert("Password and confirm password dont match");
			return 0;
		}
		$scope.resetPasswordData.email = $scope.currentEmail;
		postServerCall($scope.resetPasswordData, $rootScope.APIURL + "/resetPassword", function(response) {
			console.log(response);
			if (response == "true") {
				//alert("Password upadated");
				$scope.loginClick('LOGIN');
			} else {
				alert("failed");
			}
		})
	}
	
	$scope.getUserVotes = function(product) {
		$scope.selectedProduct = product;
		var userId = getCookie("_id");
		var request = { userId: userId, productId: $scope.selectedProduct._id };
		postServerCall(request, $rootScope.APIURL + "/getUserVote", function(response) {
			console.log(response);
			$scope.userVote = response;
		});

	}

	$scope.getProductVotes = function(product) {
		$scope.selectedProduct = product;
		var request = { productId: $scope.selectedProduct._id };
		postServerCall(request, $rootScope.APIURL + "/getProductVoteCount", function(response) {
			console.log(response);
			$scope.productVoteCount = response;
			var originalPrice = Number($scope.selectedProduct.productprice);
			var votePrice = Number($scope.selectedProduct.voteprice);
			var discount = 0;
			if (originalPrice <= 0 || isNaN(originalPrice)) {
				return 0;
			}
			if ($scope.productVoteCount >= 10 && $scope.productVoteCount <= 20) {
				discount = 0.01;
			} else if ($scope.productVoteCount > 20 && $scope.productVoteCount <= 30) {
				discount = 0.03;
			} else if ($scope.productVoteCount > 30 && $scope.productVoteCount <= 40) {
				discount = 0.05;
			} else if ($scope.productVoteCount > 40 && $scope.productVoteCount <= 50) {
				discount = 0.10;
			}
			var currentPrice = (originalPrice) * (1 - discount) - votePrice;
			$("#voteCount").text(response + " Votes");
			$(".currentPrice").text("$" + currentPrice.toFixed(2));
			$(".actualPrice").text("$" + originalPrice.toFixed(2));
			if (discount > 0) {
				$(".actualPrice").wrap("<strike  style='color: #ff9f1a;'></strike>");
			}
		});

	}
	
	$scope.getVotes = function(product) {
		$scope.selectedProduct = product;
		var request = { productId: $scope.selectedProduct._id };
		postServerCall(request, $rootScope.APIURL + "/getProductVoteCount", function(response) {
			console.log(response);
			product.votes = response;
		});

	}
	$scope.searchText = "";
	
	$scope.getImage = function() {
		var email = getCookie("email");
		var request = { email: email };
		postServerCall(request, $rootScope.APIURL + "/getUserImage", function(response) {
			console.log(response);
			$scope.image = response.image;
		})
	}

	$scope.getVoters = function(product) {
		var Id = product._id;
		var request = { Id: Id };
		postServerCall(request, $rootScope.APIURL + "/getVoters", function(response) {
			console.log(response);
			product.voters = response;
		})
	}
	
	if($scope.islogin != "undefined" && $scope.islogin != ""){
		$scope.getImage();
	}
	
}]);

marketplace.controller("vendorctrl", ["$scope", "$http", "$location", "$rootScope", function($scope, $http, $location, $rootScope) {
	//POST Server Call
	var postServerCall = function(inputdata, url, callback) {
		$http.post(url, inputdata).then(function(response) {
			callback && callback(response.data);
		});
	}
	

	$scope.islogin = getCookie("islogin");

	if ($scope.islogin == "true") {
		$scope.viewVendorPage = "VENDOR_CONTENT";
	}
	//$scope.viewVendorLoginScreen = function(page) {
	//$scope.viewVendorPage = "VENDOR_CONTENT";
	//}

	$scope.createProductClick = function(page) {
		$scope.viewVendorPage = "NEWPRODUCT";
	}

	//$scope.viewVendorPage = "HOME";
	$scope.viewVendorProduct = function(product) {
		$scope.viewVendorPage = "PRODUCT_VIEW";
		$scope.selectedProduct = product;
		if(product.rule != undefined){
			$scope.getRule(product.rule);
		}
		if(product.voterule != undefined){
			$scope.getVoteRule(product.voterule);
		}
		$scope.selectedProductImages = product.image;
		console.log($scope.selectedProductImages);
		if(product.option=="Voting"){
			$scope.getUserVotes($scope.selectedProduct);
			$scope.getProductVotes($scope.selectedProduct);
			$scope.getVoters($scope.selectedProduct);
		}
		
	}

	$scope.updateProductImage = function(element, action) {
		var reader = new FileReader();
		reader.onload = function() {
			if (action == "updateProduct") {
				$scope.productUpdatePreviousImage = $scope.selectedProduct.image;
				var size = document.getElementById("imageUpload").files[0].size / 1024;
				if (size <= 500) {
					var isFirstClick = !$scope.hasUpdatedImages;
					if (isFirstClick) {
						$scope.selectedProduct.image = [];
						$scope.hasUpdatedImages = true;
					}
					if ($scope.selectedProduct.image.length < 5) {
						var hasDuplicate = $scope.selectedProduct.image.includes(reader.result);
						if (!hasDuplicate) {
							for (var i = 0; i < element.files.length; i++) {
								$scope.selectedProduct.image.push(reader.result);
							}
							displayUpdatedImages();
						} else {
							generateAlert($rootScope, false, "This image has already been added.");
						}
					} else {
						generateAlert($rootScope, false, "You can only add up to 5 images.");
					}
				} else {
					generateAlert($rootScope, false, "Image size exceeds 500 KB");
				}
			}
		};
		reader.onerror = function(error) {
			console.log('Error: ', error);
		};
		for (var i = 0; i < element.files.length; i++) {
			reader.readAsDataURL(element.files[i]);
		}
	};

	function displayUpdatedImages() {
		$('#updateProductImageDisplay').empty();
		$scope.selectedProduct.image.forEach(function(imageSrc) {
			var img = $('<img>').attr('src', imageSrc).css({
				'width': '30px',
				'margin-right': '5px'
			});
			$('#updateProductImageDisplay').append(img);
		});
	}

	$scope.createProductData = {};
	$scope.createProduct = function() {
		var userId = getCookie("_id");
		var email = getCookie("email");
		$scope.createProductData.userId = userId;
		$scope.createProductData.vendorEmail = email;
		//$scope.viewPage = vendorPage;
		var flag = validateProduct($scope.createProductData);
        if (!flag) {
            return 0;
        }
		postServerCall($scope.createProductData, $rootScope.APIURL + "/createProduct", function(response) {
			console.log(response);
			if (response == "true") {
				$(".newproduct-response").text("Successfully Registered!! An email has been sent.");
			} else {
				$(".newproduct-response").text("Registration failed. Please re-check");
			}
			window.open("http://localhost:8080/marketplace", "_self");
		})
	}

	$scope.createProductData.image = [];

	$scope.uploadImage = function(element, action) {
		var reader = new FileReader();
		reader.readAsDataURL($(element)[0].files[0]);
		reader.onload = function() {
			var image = reader.result;
			var size = document.getElementById("productImageUpload").files[0].size / 1024;

			if (action == "productImage") {
				if (size <= 500) {
					if ($scope.createProductData.image.indexOf(image) === -1) {
						if ($scope.createProductData.image.length < 5) {
							$scope.createProductData.image.push(image);
							displayImages();
						} else {
							generateAlert($rootScope, false, "You can only upload a maximum of 5 images.");
							
						}
					} else {
						generateAlert($rootScope, false, "You have already selected this image.");
					}
				} else {
					
					generateAlert($rootScope, false, "Image size exceeds 500 KB.");
				}
			}
		};
		reader.onerror = function(error) {
			console.log('Error: ', error);
		};
	};
	function displayImages() {
		var imgContainer = $('#productImageDisplay');
		imgContainer.empty();

		console.log($scope.createProductData.image);
		$scope.createProductData.image.forEach(function(imageSrc) {
			var img = $('<img>').attr('src', imageSrc).css('width', '30px');
			imgContainer.append(img);
		});
	}
	$scope.editProduct = function() {
		postServerCall($scope.selectedProduct, $rootScope.APIURL + "/updateProduct", function(response) {
			console.log(response);
			if (response == "true") {
				$(".newproduct-response").text("Successfully Registered!! An email has been sent.");
			} else {
				$(".newproduct-response").text("Registration failed. Please re-check");
			}
			window.open("http://localhost:8080/marketplace", "_self");
		})
	}
	
	$scope.backToProducts = function() {
		$scope.viewVendorPage = "VENDOR_CONTENT";
	}

	$scope.updateProduct = function(product) {
		$scope.selectedProduct = product;
		$scope.viewVendorPage = "UPDATEPRODUCT";
	}

	$scope.backToUpdateProducts = function() {
		$scope.getVendorProducts();
		$scope.hasUpdatedImages = false;
		$scope.viewVendorPage = "VENDOR_CONTENT";
	}

	$scope.deleteProduct = function() {
		var request = { productId: $scope.selectedProduct._id };
		postServerCall(request, $rootScope.APIURL + "/deleteProduct", function(response) {
			console.log(response);
			if (response == "true") {
				alert("deleted");
				generateAlert($rootScope, false, "Product deleted");
				$scope.getVendorProducts();
				$scope.viewVendorPage = "VENDOR_CONTENT";
			} else {
				generateAlert($rootScope, false, "failed");
			}
		})

	}
	
	$scope.viewProfile = function() {
		$scope.viewVendorPage = "PROFILE";
	}
	
	$scope.viewDash = function() {
		$scope.viewVendorPage = "DASHBOARD";
	}
	
	$scope.viewCat = function() {
		$scope.viewVendorPage = "CATEGORY";
	}
	
	$scope.viewRule = function() {
		$scope.viewVendorPage = "RULE";
	}
	
	$scope.viewVoteRule = function() {
		$scope.viewVendorPage = "VOTERULE";
	}
	
	$scope.backToDash = function() {
		$scope.viewVendorPage = "DASHBOARD";
	}
	
	$scope.getVendorProducts = function() {
		var email = getCookie("email");
		var request = { email: email };
		postServerCall(request, $rootScope.APIURL + "/getVendorProducts", function(response) {
			console.log(response);
			$scope.products = response;
			$scope.products.forEach(function(product) {
				if(product.option=="Voting"){
					$scope.getVotes(product);
				}
			});
		})
	}
	
	$scope.getVendorProducts();
	
	$scope.addVoteRule = function(newRule) {
		$scope.rule = newRule;
		$scope.rule.email = getCookie("email");
		postServerCall($scope.rule, $rootScope.APIURL + "/addVoteRule", function(response) {
			console.log(response);
			$scope.getVendorVoteRules();
		})
	}
	
	$scope.selectVoteRule = function(rule) {
		$scope.selectedVoteRule = rule;
	}
	
	$scope.updateVoteRule = function(rule) {
		postServerCall(rule, $rootScope.APIURL + "/updateVoteRule", function(response) {
			console.log(response);
			$scope.getVendorVoteRules();
		})
	}
	
	$scope.toggleVoteRuleStatus = function(newRule) {
		var status = newRule.status;
		$scope.rule = newRule;
		$scope.rule.status = !status;
		postServerCall($scope.rule, $rootScope.APIURL + "/toggleVoteRuleStatus", function(response) {
			console.log(response);
			if (response == "true") {
				generateAlert($rootScope, false, "Rule Status Changed");
				$scope.getVendorVoteRules();
			} else {
				generateAlert($rootScope, false, "Failed");
			}
		})

	}
	
	$scope.voterules = {};
	
	$scope.getVendorVoteRules = function() {
		var email = getCookie("email");
		var request = { email: email };
		postServerCall(request, $rootScope.APIURL + "/getVendorVoteRule", function(response) {
			console.log(response);
			$scope.voterules = response;
		})
	}
	
	$scope.getVendorVoteRules();
	
	$scope.addRule = function(newRule) {
		$scope.rule = newRule;
		$scope.rule.email = getCookie("email");
		postServerCall($scope.rule, $rootScope.APIURL + "/addRule", function(response) {
			console.log(response);
			$scope.getVendorRules();
		})
	}
	
	$scope.selectRule = function(rule) {
		$scope.selectedRule = rule;
	}
	
	$scope.updateRule = function(rule) {
		postServerCall(rule, $rootScope.APIURL + "/updateRule", function(response) {
			console.log(response);
			$scope.getVendorRules();
		})
	}
	
	$scope.toggleRuleStatus = function(newRule) {
		var status = newRule.status;
		$scope.rule = newRule;
		$scope.rule.status = !status;
		postServerCall($scope.rule, $rootScope.APIURL + "/toggleRuleStatus", function(response) {
			console.log(response);
			if (response == "true") {
				generateAlert($rootScope, false, "Rule Status Changed");
				$scope.getVendorRules();
			} else {
				generateAlert($rootScope, false, "Failed");
			}
		})

	}
	
	$scope.rules = {};
	
	$scope.getVendorRules = function() {
		var email = getCookie("email");
		var request = { email: email };
		postServerCall(request, $rootScope.APIURL + "/getVendorRule", function(response) {
			console.log(response);
			$scope.rules = response;
		})
	}
	
	$scope.getVendorRules();
	
	$scope.addCategory = function(category) {
		var email = getCookie("email");
		var request = { email: email, name: category};
		postServerCall(request, $rootScope.APIURL + "/addCategory", function(response) {
			console.log(response);
			$scope.getVendorCategory();
		})
	}
	
	$scope.selectCat = function(category) {
		$scope.selectedCat = category;
	}
	
	$scope.updateCategory = function(category) {
		postServerCall(category, $rootScope.APIURL + "/updateCategory", function(response) {
			console.log(response);
			$scope.getVendorCategory();
		})
	}
	
	$scope.deleteCategory = function(category) {
		var request = { productId: category._id };
		postServerCall(request, $rootScope.APIURL + "/deleteCategory", function(response) {
			console.log(response);
			if (response == "true") {
				generateAlert($rootScope, false, "Category deleted");
				$scope.getVendorCategory();
			} else {
				generateAlert($rootScope, false, "Failed");
			}
		})

	}
	
	$scope.categories = {};
	
	$scope.getVendorCategory = function() {
		var email = getCookie("email");
		var request = { email: email };
		postServerCall(request, $rootScope.APIURL + "/getVendorCategory", function(response) {
			console.log(response);
			$scope.categories = response;
		})
	}
	
	$scope.getVendorCategory();
	
	$scope.getRule = function(id) {
		var Id = id;
		var request = { id: Id };
		postServerCall(request, $rootScope.APIURL + "/getRule", function(response) {
			console.log(response);
			$scope.selectedProduct.ruleName = response.name;
			$scope.selectedProduct.ruleDiscount = response.discount;
			$scope.selectedProduct.ruleQuantity = response.quantity;
			$scope.selectedProduct.ruleFree = response.free;
		})
	}
	
	$scope.getVoteRule = function(id) {
		var Id = id;
		var request = { id: Id };
		postServerCall(request, $rootScope.APIURL + "/getVoteRule", function(response) {
			console.log(response);
			$scope.selectedProduct.voteruleName = response.name;
			$scope.selectedProduct.voteruleDiscount = response.discount;
			$scope.selectedProduct.voteruleVotes = response.votes;
		})
	}

}]);

marketplace.controller("customerctrl", ["$scope", "$http", "$location", "$rootScope", function($scope, $http, $location, $rootScope) {

	//POST Server Call
	var postServerCall = function(inputdata, url, callback) {
		$http.post(url, inputdata).then(function(response) {
			callback && callback(response.data);
		});
	}
	
	$scope.islogin = getCookie("islogin");
	
	if ($scope.islogin == "true") {
		$scope.userType = getCookie("userType");
		$scope.viewCustomerPage = "CUSTOMER_CONTENT";
	}
		
	$scope.viewProduct = function(product) {
		$scope.viewCustomerPage = "PRODUCT_VIEW";
		$scope.selectedProduct = product;
		$scope.selectedProduct.buyQuantity = 1;
		$scope.selectedProductImages = product.image;
		if(product.rule != undefined){
			$scope.getRule(product.rule);
		}
		if(product.voterule != undefined){
			$scope.getVoteRule(product.voterule);
		}
		console.log($scope.selectedProductImages);
		if(product.option=="Voting"){
			$scope.getUserVotes($scope.selectedProduct);
			$scope.getProductVotes($scope.selectedProduct);
		}

	}
	
	$scope.backToProducts = function() {
		$scope.viewCustomerPage = "CUSTOMER_CONTENT";
	}
	
	$scope.backToDescription = function() {
		$scope.viewCustomerPage = "PRODUCT_VIEW";
	}
	
	$scope.totalPrice = function() {
	    $scope.selectedProduct.buyQuantity = parseInt($scope.selectedProduct.buyQuantity);
	    if ($scope.selectedProduct.rule) {
	        if ($scope.selectedProduct.ruleQuantity <= $scope.selectedProduct.buyQuantity) {
	            var remainingQuantity = $scope.selectedProduct.buyQuantity % $scope.selectedProduct.ruleQuantity;
	            var quotient = parseInt($scope.selectedProduct.buyQuantity / $scope.selectedProduct.ruleQuantity);
	            $scope.selectedProduct.totalprice = $scope.selectedProduct.productprice * remainingQuantity;
	            $scope.selectedProduct.totalprice += $scope.selectedProduct.productprice * $scope.selectedProduct.ruleQuantity * (1 - $scope.selectedProduct.ruleDiscount / 100) * quotient;
	            $scope.selectedProduct.buyQuantity += parseInt($scope.selectedProduct.ruleFree);
	        } else {
	            $scope.selectedProduct.totalprice = $scope.selectedProduct.productprice * $scope.selectedProduct.buyQuantity;
	        }
	    } else {
	        $scope.selectedProduct.totalprice = $scope.selectedProduct.productprice * $scope.selectedProduct.buyQuantity;
	    }
	}

	
	$scope.buyProduct = function(product) {
		var flag = validateQuantity(product);
        if (!flag) {
            return 0;
        }
		$scope.selectedProduct = product;
		$scope.totalPrice()
		$scope.viewCustomerPage = "BUYPRODUCT";
	}
	
	$scope.orderProduct = function(type) {
		var userId = getCookie("_id");
		var email = getCookie("email");
		$scope.selectedProduct.userId = userId;
		$scope.selectedProduct.email = email;
		$scope.selectedProduct.type = type;
		$scope.selectedProduct.no_of_items -= parseInt($scope.selectedProduct.buyQuantity);
		$scope.selectedProduct.status = "Completed";
		postServerCall($scope.selectedProduct, $rootScope.APIURL + "/orderProduct", function(response) {
			console.log(response);
			if (response == "true") {
				$scope.viewCustomerPage = "SUCCESS_PAYMENT";;
			} else {
				$scope.viewCustomerPage = "FAILURE_PAYMENT";;
			}
		})
	}
	
	$scope.voteProduct = function(type) {
		var userId = getCookie("_id");
		var email = getCookie("email");
		$scope.selectedProduct.userId = userId;
		$scope.selectedProduct.productId = $scope.selectedProduct._id;
		$scope.selectedProduct.email = email;
		$scope.selectedProduct.type = type;
		$scope.selectedProduct.status = "Completed";
		postServerCall($scope.selectedProduct, $rootScope.APIURL + "/productVoting", function(response) {
			console.log(response);
			if (response == "true") {
				$scope.viewCustomerPage = "SUCCESS_VOTING";;
				$scope.getProductVotes();
				$("#checkVote").css("background-color", "grey");
				$("#checkVote").text("Voted");
				$("#checkVote").css("cursor", "default");
			} else {
				$scope.viewCustomerPage = "FAILURE_VOTING";;
			}
		})
	}
	
	
	$scope.productVoting = function(product) {
		$scope.selectedProduct = product;
		$scope.viewCustomerPage = "VOTEPRODUCT";

	}
	
	$scope.viewProfile = function() {
		$scope.viewCustomerPage = "PROFILE";
	}
	
	
	$scope.order = {};
	
	$scope.showOrders = function() {
		var email = getCookie("email");
		var request = {email: email};
		postServerCall(request, $rootScope.APIURL + "/orders", function(response) {
			console.log(response);
			if (response != undefined) {
				$scope.order = response;
				$scope.viewCustomerPage = "ORDERED"
			} else {
				$(".login-response").text("Invalid credentials");
			}
		});
	}
	
	$scope.viewCustomerDash = function() {
		$scope.viewCustomerPage = "DASHBOARD";
	}
	
	$scope.getProducts = function() {
		var userId = getCookie("_id");
		var request = { userId: userId };
		postServerCall(request, $rootScope.APIURL + "/getProducts", function(response) {
			console.log(response);
			$scope.products = response;
			$scope.products.forEach(function(product) {
				if(product.option=="Voting"){
					$scope.getVotes(product);
				}
			});
		})
	}
	
	$scope.getProducts();
	
	$scope.categories = {};
	
	$scope.getCategory = function() {
		var userId = getCookie("_id");
		var request = { userId: userId };
		postServerCall(request, $rootScope.APIURL + "/getCategory", function(response) {
			console.log(response);
			$scope.categories = response;
		})
	}
	
	$scope.getCategory();
	
	$scope.getRule = function(id) {
		var Id = id;
		var request = { id: Id };
		postServerCall(request, $rootScope.APIURL + "/getRule", function(response) {
			console.log(response);
			$scope.selectedProduct.ruleName = response.name;
			$scope.selectedProduct.ruleDiscount = response.discount;
			$scope.selectedProduct.ruleQuantity = response.quantity;
			$scope.selectedProduct.ruleFree = response.free;
		})
	}
	
	$scope.getVoteRule = function(id) {
		var Id = id;
		var request = { id: Id };
		postServerCall(request, $rootScope.APIURL + "/getVoteRule", function(response) {
			console.log(response);
			$scope.selectedProduct.voteruleName = response.name;
			$scope.selectedProduct.voteruleDiscount = response.discount;
			$scope.selectedProduct.voteruleVotes = response.votes;
		})
	}
	
	$scope.decreaseQuantity = function() {
	  if ($scope.selectedProduct.buyQuantity > 1) {
	    $scope.selectedProduct.buyQuantity--;
	  }
	};
	
	$scope.increaseQuantity = function() {
	  if ($scope.selectedProduct.buyQuantity < $scope.selectedProduct.no_of_items) {
	    $scope.selectedProduct.buyQuantity++;
	  }
	};

	/*$scope.userSignInData = {};
	$scope.userLogin = function() {
		$scope.userSignInData.userType = "USER";
		postServerCall($scope.userSignInData, $rootScope.APIURL+"/signIn", function(response) {
			console.log(response);
			if (response == "true") {
				//$(".login-response").text("Successfully Registered!! An email has been sent.");
				setCookie("islogin", true);
				$scope.vendorMail = userSignInData.email;
				setCookie("email", vendorMail);
				setCookie("userType", "USER");
				window.open("http://localhost:8080/marketplace", "_self");
			} else {
				$(".login-response").text("Invalid credentials");
			}
		})
	}*/

}]);

/*marketplace.controller("adminctrl", ["$scope", "$http", "$location", "$rootScope", function($scope, $http, $location, $rootScope) {


}]);*/