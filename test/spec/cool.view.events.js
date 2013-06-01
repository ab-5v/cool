describe('cool.view.events', function() {

    var events = cool.view.events;

    describe('info', function() {

        /* global cool_view_events_info */
        /* jshint -W106 */
        xtnd.each(cool_view_events_info, function(res, desc) {

            it('should parse "' + desc + '"', function() {

                expect( events.info(desc) ).to.eql( res );
            });
        });
    });

    describe('view', function() {

        beforeEach(function() {
            this.view = new cool.view();
        });

        it('should ensure `view.events`', function() {
            events.view( this.view );

            expect( this.view.events ).to.eql( {} );
        });

        it('should keep original events', function() {
            this.view.events = {'click': 'init'};
            events.view( this.view );

            expect( this.view.events ).to.eql( {'click': 'init'} );
        });

    });


    describe('parse', function() {

        beforeEach(function() {
            this.view = new cool.view();
            this.view.test = sinon.spy();
            this.listener = sinon.spy();
            this.view.events = {'click': 'test', 'submit': this.listener};
            this.parsed = events.parse( this.view );
        });

        it('should call `info` for each event item', function() {
            sinon.spy(events, 'info');
            events.parse( this.view );

            expect( events.info.calledTwice ).to.be.ok();

            expect( events.info.getCall(0).args ).to.eql( ['click'] );
            expect( events.info.getCall(1).args ).to.eql( ['submit'] );

            events.info.restore();
        });

        it('should return parsed array', function() {

            expect( this.parsed ).to.be.an( Array );
            expect( this.parsed.length ).to.eql( 2 );
        });

        it('should return empty array on no events', function() {
            this.view.events = {};

            expect( events.parse(this.view) ).to.eql( [] );
        });

        it('should throw if listener is not a function', function() {
            var view = this.view;
            this.view.events = {'click': 'foo'};

            expect( function() { events.parse(view); } )
                .to.throwError(/listener/i);
        });

        it('should return view\'s method as listener', function() {
            this.parsed[0].listener();

            expect( this.view.test.calledOnce ).to.be.ok();
        });

        it('should return a function as listener', function() {
            this.parsed[1].listener();

            expect( this.listener.calledOnce ).to.be.ok();
        });

        it('should call view\' method in context of view', function() {
            this.parsed[0].listener();

            expect( this.view.test.calledOn( this.view) ).to.be.ok();
        });

        it('should bind listener in context of view', function() {
            this.parsed[1].listener();

            expect( this.listener.calledOn( this.view) ).to.be.ok();
        });

    });


    describe('dom', function() {

        beforeEach(function() {
            this.view = { el: { on: sinon.spy() } };
            this.info = {
                kind: 'dom',
                type: 'click',
                master: 'this',
                listener: function() {}
            };
        });

        it('should call `on` on events kind a dom', function() {
            events.dom(this.view, [ this.info ]);

            expect( this.view.el.on.calledOnce ).to.be.ok();
        });

        it('should call `on` on each event kind a dom', function() {
            events.dom(this.view, [ {kind: 'dom'}, {kind: 'dom'} ]);

            expect( this.view.el.on.calledTwice ).to.be.ok();
        });

        it('should skip all events w/o kind dom', function() {
            events.dom(this.view, [ {}, {kind: 'view'}, {kind: 'model'} ]);

            expect( this.view.el.on.called ).not.to.be.ok();
        });

        it('should call w/o selector on `master=this`', function() {
            events.dom(this.view, [ this.info ]);

            expect( this.view.el.on.getCall(0).args )
                .to.eql( ['click', this.info.listener] );
        });

        it('should call w selector on `master!=this`', function() {
            this.info.master = '.selector';
            events.dom(this.view, [ this.info ]);

            expect( this.view.el.on.getCall(0).args )
                .to.eql( ['click', '.selector', this.info.listener] );
        });

    });

});
