describe('cool', function() {

    beforeEach(function() {
        this.inst = new cool();
    });

    it('should provide events', function() {

        expect( this.inst.on ).to.be.a( Function );
        expect( this.inst.off ).to.be.a( Function );
        expect( this.inst.emit ).to.be.a( Function );
    });

    it('should provide "data" store', function() {

        expect( this.inst.data ).to.be.a( Function );
    });

    it('should provide "param" store', function() {

        expect( this.inst.param ).to.be.a( Function );
    });

});
