describe('MyApp', function() {
    beforeEach(function() {

    });

    afterEach(function() {

    });

    it('set and get a property', function() {
        MyApp.setProperty(42);
        expect(MyApp.getProperty()).toBe(42);
    });
});
