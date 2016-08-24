'use strict';

(function() {
	// Subcategories Controller Spec
	describe('Subcategories Controller Tests', function() {
		// Initialize global variables
		var SubcategoriesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Subcategories controller.
			SubcategoriesController = $controller('SubcategoriesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Subcategory object fetched from XHR', inject(function(Subcategories) {
			// Create sample Subcategory using the Subcategories service
			var sampleSubcategory = new Subcategories({
				name: 'New Subcategory'
			});

			// Create a sample Subcategories array that includes the new Subcategory
			var sampleSubcategories = [sampleSubcategory];

			// Set GET response
			$httpBackend.expectGET('subcategories').respond(sampleSubcategories);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.subcategories).toEqualData(sampleSubcategories);
		}));

		it('$scope.findOne() should create an array with one Subcategory object fetched from XHR using a subcategoryId URL parameter', inject(function(Subcategories) {
			// Define a sample Subcategory object
			var sampleSubcategory = new Subcategories({
				name: 'New Subcategory'
			});

			// Set the URL parameter
			$stateParams.subcategoryId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/subcategories\/([0-9a-fA-F]{24})$/).respond(sampleSubcategory);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.subcategory).toEqualData(sampleSubcategory);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Subcategories) {
			// Create a sample Subcategory object
			var sampleSubcategoryPostData = new Subcategories({
				name: 'New Subcategory'
			});

			// Create a sample Subcategory response
			var sampleSubcategoryResponse = new Subcategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Subcategory'
			});

			// Fixture mock form input values
			scope.name = 'New Subcategory';

			// Set POST response
			$httpBackend.expectPOST('subcategories', sampleSubcategoryPostData).respond(sampleSubcategoryResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Subcategory was created
			expect($location.path()).toBe('/subcategories/' + sampleSubcategoryResponse._id);
		}));

		it('$scope.update() should update a valid Subcategory', inject(function(Subcategories) {
			// Define a sample Subcategory put data
			var sampleSubcategoryPutData = new Subcategories({
				_id: '525cf20451979dea2c000001',
				name: 'New Subcategory'
			});

			// Mock Subcategory in scope
			scope.subcategory = sampleSubcategoryPutData;

			// Set PUT response
			$httpBackend.expectPUT(/subcategories\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/subcategories/' + sampleSubcategoryPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid subcategoryId and remove the Subcategory from the scope', inject(function(Subcategories) {
			// Create new Subcategory object
			var sampleSubcategory = new Subcategories({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Subcategories array and include the Subcategory
			scope.subcategories = [sampleSubcategory];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/subcategories\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSubcategory);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.subcategories.length).toBe(0);
		}));
	});
}());