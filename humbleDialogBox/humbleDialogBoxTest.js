
YAHOO.namespace('Humble.test');

var Assert = YAHOO.util.Assert;

YAHOO.Humble.test.oTestInitializeComposer = new YAHOO.tool.TestCase({
    name: "TestInitializeComposer",
    testInitializeComposer: function () {
        var mockView = Humble.mockView();
        var composer = Humble.composer(mockView);
        Assert.isArray(mockView.getSelectionList());
        Assert.areEqual(0, mockView.getSelectionList().length, 'selectionList should be empty');
        composer.initialize();
        Assert.areEqual(4, mockView.getSelectionList().length, 'selectionList should contain two elements');
    }
});
YAHOO.Humble.test.oTestSelectFilter = new YAHOO.tool.TestCase({
    name: "TestSelectFilter",
    testSelectFilter: function () {

        var mockView = Humble.mockView();
        var composer = Humble.composer(mockView);
        composer.initialize();
        Assert.isArray(mockView.getComposedFilter());
        Assert.areEqual(0, mockView.getComposedFilter().length, 'composedFilter should be empty');
        composer.add(0);
        Assert.areEqual(1, mockView.getComposedFilter().length, 'composedFilter shouldnt be empty');
        Assert.isObject(mockView.getComposedFilter()[0], 'no filter present in composedFilter');
    }
});
YAHOO.Humble.test.oTestRemoveFilter = new YAHOO.tool.TestCase({
    name: "TestRemoveFilter",
    testRemoveFilter: function () {
        var mockView = Humble.mockView();
        var composer = Humble.composer(mockView);
        composer.initialize();
        composer.add(1);
        Assert.areEqual(1, mockView.getComposedFilter().length);
        Assert.areEqual('passa-alto', mockView.getComposedFilter()[0].type);
        composer.remove(0);
        Assert.areEqual(0, mockView.getComposedFilter().length);
    }
});
YAHOO.Humble.test.oTestMoveUpFilter = new YAHOO.tool.TestCase({
    name: "TestMoveUpFilter",
    testMoveUpFilter: function () {
        var mockView = Humble.mockView();
        var composer = Humble.composer(mockView);
        composer.initialize();
        composer.add(0);
        composer.add(1);
        Assert.areEqual(2, mockView.getComposedFilter().length, 'composedFilter should have size 2');
        Assert.areEqual('passa-alto', mockView.getComposedFilter()[1].type, 'composedFilter should contain passa-alto filter at pos 1');
        composer.moveUp(1);
        Assert.areEqual('passa-alto', mockView.getComposedFilter()[0].type, 'composedFilter should contain passa-alto filter at pos 0');
    }
});
YAHOO.Humble.test.oTestMoveDownTwiceFilter = new YAHOO.tool.TestCase({
    name: "TestMoveDownTwiceFilter",
    testMoveDownTwiceFilter: function () {
        var mockView = Humble.mockView();
        var composer = Humble.composer(mockView);
        composer.initialize();
        composer.add(0); // passa-basso
        composer.add(1); // passa-alto
        composer.add(1); // passa-alto
        Assert.areEqual(3, mockView.getComposedFilter().length);
        Assert.areEqual('passa-basso', mockView.getComposedFilter()[0].type);
        composer.moveDown(0);
        composer.moveDown(1);
        Assert.areEqual('passa-alto', mockView.getComposedFilter()[0].type);
        Assert.areEqual('passa-alto', mockView.getComposedFilter()[1].type);
        Assert.areEqual('passa-basso', mockView.getComposedFilter()[2].type);
    }
});
YAHOO.Humble.test.oTestRemoveAllFilters = new YAHOO.tool.TestCase({
    name: "TestRemoveAllFilters",
    testRemoveAllFilters: function () {
        var mockView = Humble.mockView();
        var composer = Humble.composer(mockView);
        composer.initialize();
        composer.add(0); // passa-basso
        composer.add(1); // passa-alto
        composer.add(1); // passa-alto
        Assert.areEqual(3, mockView.getComposedFilter().length);
        composer.removeAll(function () { return true; });
        Assert.areEqual(0, mockView.getComposedFilter().length);
    }
});
YAHOO.Humble.test.oTestCreateCompareFilter = new YAHOO.tool.TestCase({
    name: "TestCreateCompareFilter",
    testCreateCompareFilter: function () {
        var passaBasso = Filter.instance('passa-basso');
        Assert.areEqual('passa-basso', passaBasso.type);
        Assert.isTrue(passaBasso.compareTo(passaBasso));
        var passaAlto = Filter.instance('passa-alto');
        Assert.isFalse(passaBasso.compareTo(passaAlto));
        var passaAlto2 = Filter.instance('passa-alto');
        Assert.isTrue(passaAlto2.compareTo(passaAlto));
        Assert.isTrue(passaAlto.compareTo(passaAlto2));
    }
});
YAHOO.Humble.test.oTestMoveUpperLowerFilter = new YAHOO.tool.TestCase({
    name: "TestMoveUpperLowerFilter",
    testMoveUpperLowerFilter: function () {
        var mockView = Humble.mockView();
        var composer = Humble.composer(mockView);
        composer.initialize();
        composer.add(0); // passa-basso
        composer.add(1); // passa-alto
        composer.moveUp(0);
        Assert.areEqual('passa-basso', mockView.getComposedFilter()[0].type);
        composer.moveDown(1);
        Assert.areEqual('passa-alto', mockView.getComposedFilter()[1].type);
    }
});


YAHOO.Humble.test.HumbleTestSuite = new YAHOO.tool.TestSuite("YUI Test Suite for Humble Dialog Box");
YAHOO.Humble.test.HumbleTestSuite.add(YAHOO.Humble.test.oTestInitializeComposer);
YAHOO.Humble.test.HumbleTestSuite.add(YAHOO.Humble.test.oTestSelectFilter);
YAHOO.Humble.test.HumbleTestSuite.add(YAHOO.Humble.test.oTestRemoveFilter);
YAHOO.Humble.test.HumbleTestSuite.add(YAHOO.Humble.test.oTestRemoveAllFilters);
YAHOO.Humble.test.HumbleTestSuite.add(YAHOO.Humble.test.oTestMoveUpFilter);
YAHOO.Humble.test.HumbleTestSuite.add(YAHOO.Humble.test.oTestMoveDownTwiceFilter);
YAHOO.Humble.test.HumbleTestSuite.add(YAHOO.Humble.test.oTestCreateCompareFilter);
YAHOO.Humble.test.HumbleTestSuite.add(YAHOO.Humble.test.oTestMoveUpperLowerFilter);

YAHOO.util.Event.onDOMReady(function (){
	var logger = new YAHOO.tool.TestLogger("testLoggerHumble");
	YAHOO.tool.TestRunner.add(YAHOO.Humble.test.HumbleTestSuite);
});

/*               -----------------------------------              

YAHOO.refactoring.test.oTestRental= new YAHOO.tool.TestCase({ 
	name : "TestRental",
	testRental : function () {
		var testMovie = regularMovie('testMovie');
		var testRental = rental(testMovie, 11);
		Assert.isObject(testRental,'testRental is not an object');
		Assert.areEqual('testMovie', testRental.getMovie().getTitle(), 'movie title is not OK');
		Assert.areEqual(11, testRental.getDaysRented(), 'wrong or non-existing days rented number');
		Assert.areEqual(15.5, testRental.calculateRentalCost(), 'problems in calculating rental cost through a rental instance');
		
		Assert.areEqual(1,rental(regularMovie(''),1).calculateFrequentRenterPoints());
		Assert.areEqual(1,rental(regularMovie(''),3).calculateFrequentRenterPoints());
		Assert.areEqual(1,rental(childrenMovie(''),1).calculateFrequentRenterPoints());
		Assert.areEqual(1,rental(childrenMovie(''),3).calculateFrequentRenterPoints());
		Assert.areEqual(1,rental(newReleaseMovie(''),1).calculateFrequentRenterPoints());
		Assert.areEqual(2,rental(newReleaseMovie(''),2).calculateFrequentRenterPoints());
		
		Assert.areEqual(0,gratisRental(regularMovie(''),1).calculateRentalCost());
		Assert.areEqual(0,gratisRental(regularMovie(''),3).calculateRentalCost());
		Assert.areEqual(0,gratisRental(childrenMovie(''),1).calculateRentalCost());
		Assert.areEqual(0,gratisRental(childrenMovie(''),3).calculateRentalCost());
		Assert.areEqual(0,gratisRental(newReleaseMovie(''),1).calculateRentalCost());
		Assert.areEqual(0,gratisRental(newReleaseMovie(''),2).calculateRentalCost());

	}
});

YAHOO.refactoring.test.oTestCustomer= new YAHOO.tool.TestCase({ 
	name : "TestCustomer",
	testCustomer : function () {
		var testMovie = regularMovie('testMovie');
		var testRental = rental(testMovie, 11);
		var testCustomer = customer('testCustomer', []);
		testCustomer.addRental(testRental).addRental(testRental);
		
		Assert.isObject(testCustomer,'testCustomer is not an object');
		Assert.isArray(testCustomer.getRentals(), 'rentals for testCustomer are not an array');
		Assert.areEqual(2, testCustomer.getRentals().length , 'number of rentals is not OK');
    
		Assert.areEqual('testMovie', testCustomer.getRentals()[0].getMovie().getTitle(), 'first movie title is not OK');
		Assert.areEqual('testMovie', testCustomer.getRentals()[1].getMovie().getTitle(), 'second movie title is not OK');
		Assert.areEqual(11, testRental.getDaysRented(), 'wrong or non-existing days rented number');            
	}
});

YAHOO.refactoring.test.oTestNoRentalsNoPoints= new YAHOO.tool.TestCase({ 
	name : "TestNoRentalsNoPoints",
	testNoRentalsNoPoints : function () {
		var testCustomer = customer('testCustomer', []);
		Assert.isTrue(testCustomer.createStatement().indexOf('is 0') != -1, 'due amount calculation is not OK');
		Assert.isTrue(testCustomer.createStatement().indexOf('earned 0') != -1, 'renter points calculation is not OK');
	}
});

YAHOO.refactoring.test.oTestStatement= new YAHOO.tool.TestCase({ 
	name : "TestStatement",
	testStatement : function () {
		var testMovie = newReleaseMovie('testMovie');
		var testRental = rental(testMovie, 11);
		var testCustomer = customer('testCustomer', []);
		testCustomer.addRental(testRental);
		
//		Assert.isTrue(testCustomer.createStatement().indexOf('testCustomer') != -1, 'handling of customer name is not OK');
//		Assert.isTrue(testCustomer.createStatement().indexOf('testMovie') != -1, 'handling of movie title is not OK');
	    
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(2, 1, regularMovie('r'), 1);
  	Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(2, 1, regularMovie('r'), 2);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(3.5, 1, regularMovie('r'), 3);
 		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(5, 1, regularMovie('r'), 4);
		
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(3, 1, newReleaseMovie('n'), 1);
		
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(6, 2, newReleaseMovie('n'), 2);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(9, 2, newReleaseMovie('n'), 3);
		
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(1.5, 1, childrenMovie('c'), 2);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(1.5, 1, childrenMovie('c'), 3);
  	Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(3, 1, childrenMovie('c'), 4);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental(4.5, 1, childrenMovie('c'), 5);
		
		// ORA LA PARTE PER MULTIPLE RENTALS
	Assertions.assertAmount_RenterPointsForPriceCode_DaysMultipleRental(5.5, 2, [regularMovie('r'), regularMovie('r')], [1, 3]);
	Assertions.assertAmount_RenterPointsForPriceCode_DaysMultipleRental(11, 3, [regularMovie('r'), newReleaseMovie('n')], [1, 3]);
	Assertions.assertAmount_RenterPointsForPriceCode_DaysMultipleRental(14, 4, [regularMovie('r'), newReleaseMovie('n'), newReleaseMovie('n')], [1, 3, 1]);
	Assertions.assertAmount_RenterPointsForPriceCode_DaysMultipleRental(17, 5, [regularMovie('r'), newReleaseMovie('n'), newReleaseMovie('n'), childrenMovie('c')], [1, 3, 1, 4]);
	}
});

YAHOO.refactoring.test.oTestTotals = new YAHOO.tool.TestCase({ 
	name : "TestTotals",
	testTotals : function () {
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(2, 1, regularMovie('r'), 1);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(2, 1, regularMovie('r'), 2);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(3.5, 1, regularMovie('r'), 3);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(5, 1, regularMovie('r'), 4);
		
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(3, 1, newReleaseMovie('n'), 1);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(6, 2, newReleaseMovie('n'), 2);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(9, 2, newReleaseMovie('n'), 3);
		
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(1.5, 1, childrenMovie('c'), 2);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(1.5, 1, childrenMovie('c'), 3);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(3, 1, childrenMovie('c'), 4);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals(4.5, 1, childrenMovie('c'), 5);
		
		// ORA LA PARTE PER MULTIPLE RENTALS - NB il customerBuilder richiede pricecodes e non movie implementations
		Assertions.assertAmount_RenterPointsForPriceCode_DaysMultipleRental_throughTotals(5.5, 2, [regularMovie('r'), regularMovie('r')], [1, 3]);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysMultipleRental_throughTotals(11, 3, [regularMovie('r'), newReleaseMovie('n')], [1, 3]);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysMultipleRental_throughTotals(14, 4, [regularMovie('r'), newReleaseMovie('n'), newReleaseMovie('n')], [1, 3, 1]);
		Assertions.assertAmount_RenterPointsForPriceCode_DaysMultipleRental_throughTotals(17, 5, [regularMovie('r'), newReleaseMovie('n'), newReleaseMovie('n'), childrenMovie('c')], [1, 3, 1, 4]);
	}
});

YAHOO.refactoring.test.oTestCustomerBuilder = new YAHOO.tool.TestCase({
	name : "TestCustomerBuilder",
	testCustomerBuilder : function () {
		var testCustomer = testCustomerBuilder.buildCustomer([regularMovie('r'), childrenMovie('c')],[1,12]);
		Assert.isTrue(testCustomer.getRentals().length == 2);
		Assert.isTrue(testCustomer.getRentals()[1].getMovie().getPriceCode() == priceCodes.CHILDRENS);
		Assert.isTrue(testCustomer.getRentals()[1].getDaysRented() == 12);
	}
});

YAHOO.refactoring.test.oTestMovieImplementations = new YAHOO.tool.TestCase({
	name : "TestMovieImplementations",
	testMovieImplementation : function () {
		Assertions.assertEverythingAboutMovieSubclasses(childrenMovie('Peter Pan'), 5, 'Peter Pan', priceCodes.CHILDRENS, 4.5, 1);
		Assertions.assertEverythingAboutMovieSubclasses(regularMovie('Forrest Gump'), 7, 'Forrest Gump', priceCodes.REGULAR, 9.5, 1);
		Assertions.assertEverythingAboutMovieSubclasses(newReleaseMovie('Birilla'), 5, 'Birilla', priceCodes.NEW_RELEASE, 15, 2);
		Assertions.assertEverythingAboutMovieSubclasses(newReleaseMovie('BirillaPirilla'), 1, 'BirillaPirilla', priceCodes.NEW_RELEASE, 3, 1);
		try {
			rental(movie('Any Title', 99), 99).calculateRentalCost();
		} catch (exception) {
			Assert.areEqual('UnsupportedOperationException', exception.name);
		}
	}
});

YAHOO.refactoring.test.oTestReportFormatter = new YAHOO.tool.TestCase({
	name : "TestReportFormatter",
	testReportFormatter : function () {
		var amount = 11;
		var points = 33;
		var formatter = reportFormatter({'totalAmount':amount,'totalPoints':points});
		var stringa = formatter.formatReport();
		Assert.isTrue(stringa.indexOf('is ' + amount) != -1, 'due amount formatting is not OK');
		Assert.isTrue(stringa.indexOf('earned ' + points) != -1, 'renter points formatting is not OK');
	}
});

YAHOO.refactoring.test.DomainClassesTestSuite = new YAHOO.tool.TestSuite("YUI Test Suite for Refactoring"); 
  YAHOO.refactoring.test.DomainClassesTestSuite.add(YAHOO.refactoring.test.oTestMovie);
  YAHOO.refactoring.test.DomainClassesTestSuite.add(YAHOO.refactoring.test.oTestRental);
  YAHOO.refactoring.test.DomainClassesTestSuite.add(YAHOO.refactoring.test.oTestCustomer);
  YAHOO.refactoring.test.DomainClassesTestSuite.add(YAHOO.refactoring.test.oTestNoRentalsNoPoints);
  YAHOO.refactoring.test.DomainClassesTestSuite.add(YAHOO.refactoring.test.oTestStatement);
  YAHOO.refactoring.test.DomainClassesTestSuite.add(YAHOO.refactoring.test.oTestTotals);

YAHOO.refactoring.test.UtilitiesTestSuite = new YAHOO.tool.TestSuite("YUI Test Suite for Utilities"); 
		YAHOO.refactoring.test.UtilitiesTestSuite.add(YAHOO.refactoring.test.oTestCustomerBuilder);
		YAHOO.refactoring.test.UtilitiesTestSuite.add(YAHOO.refactoring.test.oTestReportFormatter);

YAHOO.refactoring.test.MovieImplementationsTestSuite = new YAHOO.tool.TestSuite("YUI Test Suite for Movie Implementations"); 
YAHOO.refactoring.test.MovieImplementationsTestSuite.add(YAHOO.refactoring.test.oTestMovieImplementations);

YAHOO.util.Event.onDOMReady(function (){
	var logger = new YAHOO.tool.TestLogger("testLoggerMarco");
	YAHOO.tool.TestRunner.add(YAHOO.refactoring.test.DomainClassesTestSuite);
	YAHOO.tool.TestRunner.add(YAHOO.refactoring.test.UtilitiesTestSuite);
	YAHOO.tool.TestRunner.add(YAHOO.refactoring.test.MovieImplementationsTestSuite);
});
   
var Assertions = {
  assertAmount_RenterPointsForPriceCode_DaysSingleRental : function(amount, points, movie, days) {
  	aCustomer = customer('',[rental(movie,days)]);
		Assert.isTrue(aCustomer.createStatement().indexOf('is ' + amount) != -1, 'movie:' + movie.getTitle() + '; days: ' + days + '. Due amount calculation is not OK');
		Assert.isTrue(aCustomer.createStatement().indexOf('earned ' + points) != -1, 'movie:' + movie.getTitle() + '; days: ' + days + '. Renter points calculation is not OK');
	},
	
  assertAmount_RenterPointsForPriceCode_DaysSingleRental_throughTotals : function(amount, points, movie, days) {
  	aCustomer = customer('',[rental(movie,days)]);
		Assert.areEqual(amount, aCustomer.calculateTotalRentalCost(), 'due amount calculation is not OK');
		Assert.areEqual(points, aCustomer.calculateTotalFrequentRenterPoints(), 'renter points calculation is not OK');
	},
	
   assertAmount_RenterPointsForPriceCode_DaysMultipleRental : function(amount, points, movies, days) {
    var testCustomer = testCustomerBuilder.buildCustomer(movies, days);
		Assert.isTrue(testCustomer.createStatement().indexOf('is ' + amount) != -1, 'due amount calculation is not OK');
		Assert.isTrue(testCustomer.createStatement().indexOf('earned ' + points) != -1, 'renter points calculation is not OK');
   },

   assertAmount_RenterPointsForPriceCode_DaysMultipleRental_throughTotals : function(amount, points, movies, days) {
    var testCustomer = testCustomerBuilder.buildCustomer(movies, days);
		Assert.areEqual(amount, testCustomer.calculateTotalRentalCost(), 'due amount calculation is not OK');
		Assert.areEqual(points, testCustomer.calculateTotalFrequentRenterPoints(), 'renter points calculation is not OK');
   },
        
   assertEverythingAboutMovieSubclasses : function (aMovie, daysRented, title, priceCode, rentalCost, renterPoints) {
 			Assert.areEqual(title, aMovie.getTitle());
			Assert.areEqual(priceCode, aMovie.getPriceCode());
			var testRental = rental(aMovie, daysRented);
			Assert.areEqual(rentalCost, aMovie.calculateRentalCost(testRental));
			Assert.areEqual(renterPoints, aMovie.calculateFrequentRenterPoints(testRental));
   }
};
*/