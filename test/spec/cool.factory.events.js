describe('cool.factory.events', function() {

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

            sinon.spy(events, 'on');
            sinon.spy(events, 'dom');
            sinon.stub(events, 'parse', function() { return {a: 1}; });
            sinon.spy(events, 'restore');
        });

        afterEach(function() {
            events.on.restore();
            events.dom.restore();
            events.parse.restore();
            events.restore.restore();
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

        it('should call `events.dom` when view is `rendered`', function() {
            events.view( this.view );
            this.view.emit( this.view._event('rendered') );

            expect( events.dom.calledOnce ).to.be.ok();
            expect( events.dom.getCall(0).args[0] ).to.eql( this.view );
        });

        it('should call `events.dom` only on first `rendered`', function() {
            events.view( this.view );
            this.view.emit('rendered');
            this.view.emit('rendered');

            expect( events.dom.calledOnce ).to.be.ok();
        });

        it('should pass parsed events to `events.dom`', function() {
            this.view.events = {'click': 'init'};
            events.view( this.view );
            this.view.emit('rendered');

            expect( events.dom.getCall(0).args[1] )
                .to.eql( events.parse(this.view) );

        });

        it('should call `events.on`', function() {
            events.view( this.view );

            expect( events.on.calledOnce ).to.be.ok();
            expect( events.on.getCall(0).args[0] ).to.eql( this.view );
        });

        it('should pass parsed events to `events.on`', function() {
            this.view.events = {'click': 'init'};
            events.view( this.view );

            expect( events.on.getCall(0).args[1] )
                .to.eql( events.parse(this.view) );
        });

        it('should call `events.restore`', function() {
            events.view( this.view, 'view' );

            expect( events.restore.calledOnce ).to.be.ok();
            expect( events.restore.getCall(0).args )
                .to.eql( [this.view, 'view'] );
        });
    });

    describe('model', function() {

        beforeEach(function() {
            this.model = new cool.model();
            sinon.spy(events, 'restore');
        });

        afterEach(function() {
            events.restore.restore();
        });

        it('should call `events.restore`', function() {
            events.model( this.model );

            expect( events.restore.calledOnce ).to.be.ok();
            expect( events.restore.getCall(0).args )
                .to.eql( [this.model, 'model'] );
        });

    });

    describe('on', function() {

        beforeEach(function() {
            this.view = new cool.view();
            this.model = new cool.model();

            this.ev = {
                kind: 'view', type: 'append',
                master: 'ev', slave: 'subview',
                listener: sinon.spy()
            };
            this.ed = {
                kind: 'dom', type: 'click',
                listener: sinon.spy()
            };
            this.em = {
                kind: 'model', type: 'read',
                master: 'em',
                listener: sinon.spy()
            };
            this.et = {
                kind: 'view', type: 'init', slave: 'sub1', master: 'this',
                listener: sinon.spy()
            };

            sinon.spy(events, 'store');
            sinon.spy(this.view, 'on');
        });

        afterEach(function() {
            cool.view._events = {};
            cool.model._events = {};

            events.store.restore();
        });

        it('should ignore `dom` events', function() {
            events.on(this.view, [this.ev, this.ed, this.em]);

            expect( events.store.calledTwice ).to.be.ok();
            expect( events.store.getCall(0).args[1] ).to.eql(this.ev);
            expect( events.store.getCall(1).args[1] ).to.eql(this.em);
        });


        it('should isolate `this` events from store', function() {
            events.on(this.view, [this.et]);

            expect( events.store.called ).not.to.be.ok();
        });

        it('should bind `this` events immediately', function() {
            events.on(this.view, [this.et]);

            expect( this.view.on.calledOnce ).to.be.ok();
            expect( this.view.on.getCall(0).args )
                .to.be.eql([
                    'init',
                    this.et.listener,
                    'sub1'
                ]);
        });

        it('should add event to queue', function() {
            events.on(this.view, [this.ev]);

            expect( events.store.calledOnce ).to.be.ok();
            expect( events.store.getCall(0).args )
                .to.eql( [this.view, this.ev] );
        });

        it('should process existing views', function() {
            var spy = sinon.spy();
            cool.view._insts = [{name: 'ev', on: spy}];
            events.on(this.view, [this.ev]);

            expect( spy.calledOnce ).to.be.ok();
            expect( spy.getCall(0).args )
                .to.eql( [
                    'append',
                    this.ev.listener,
                    'subview'
                ]);
        });

        it('should process existing models', function() {
            var spy = sinon.spy();
            cool.model._insts = [{name: 'em', on: spy}];
            events.on(this.view, [this.em]);

            expect( spy.calledOnce ).to.be.ok();
            expect( spy.getCall(0).args )
                .to.eql( [
                    'read',
                    this.em.listener,
                    undefined
                ]);
        });

        it('should filter instances', function() {
            var spy = sinon.spy();
            cool.view._insts = [{name: 'ef', on: spy}];
            events.on(this.view, [this.ev]);

            expect( spy.called ).not.to.be.ok();
        });

        describe('store', function() {

            it('should ensure queue', function() {
                events.store({}, this.ev);

                expect( cool.view._events['ev'] )
                    .to.be.an( Array );
            });

            it('should store event', function() {
                events.store(this.view, this.ev);

                expect( cool.view._events['ev'][0] )
                    .to.eql({
                        type: this.ev.type,
                        slave: this.ev.slave,
                        listener: this.ev.listener
                    });
            });

        });

        describe('restore', function() {

            it('should process view', function() {
                var view = {name: 'ev', on: sinon.spy()};
                cool.view._events['ev'] = [ this.ev ];
                events.restore(view, 'view');

                expect( view.on.calledOnce ).to.be.ok();
                expect( view.on.getCall(0).args )
                    .to.eql( [
                        'append',
                        this.ev.listener,
                        'subview'
                    ]);
            });

            it('should process model', function() {
                var model = {name: 'em', on: sinon.spy(), context: {}};
                cool.model._events['em'] = [ this.em ];
                events.restore(model, 'model');

                expect( model.on.calledOnce ).to.be.ok();
                expect( model.on.getCall(0).args )
                    .to.eql( [
                        'read',
                        this.em.listener,
                        undefined
                    ]);
            });

            it('should filter instances', function() {
                var view = {name: 'ev', on: sinon.spy(), context: {}};
                events.restore(view, 'view');

                expect( view.on.called ).not.to.be.ok();
            });

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

        it('should keep items formated', function() {
            var res = this.parsed[0];
            delete res.listener;

            expect( res ).to.eql( events.info('click') );
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
