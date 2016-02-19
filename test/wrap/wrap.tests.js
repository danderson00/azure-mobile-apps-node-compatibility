var wrap = require('../../wrap'),
    expect = require('chai').use(require('chai-subset')).expect

describe('azure-mobile-apps.compatibility.wrap', function () {
    it("read returns mobile app compatible function", function () {
        var innerExecuted = false,
            context = {
                tables: {},
                push: {},
                req: {},
                res: {},
                user: {},
                query: {}
            },
            wrapped = wrap.read(function (tables, push, request, response, user) {
                return function read(query, user, request) {
                    innerExecuted = true;
                    expect(tables).to.equal(context.tables)
                    expect(push).to.equal(context.push)
                    expect(request).to.equal(context.req)
                    expect(response).to.equal(context.res)
                    expect(user).to.equal(context.user)
                    expect(query).to.equal(context.query)
                }
            })
        wrapped(context)
        expect(innerExecuted).to.be.true;
    })

    it("wrapped function returns undefined if request.execute is not executed", function () {
        var wrapped = wrap.read(function (tables, push, request, response, user) {
            return function read(query, user, request) { }
        })
        expect(wrapped({ req: {} })).to.be.undefined
    })

    it("wrapped function returns promise from context.execute if request.execute is not executed", function () {
        var wrapped = wrap.read(function (tables, push, request, response, user) {
            return function read(query, user, request) {
                request.execute()
            }
        })
        expect(wrapped({ req: {}, execute: execute })).to.be.a('Promise')

        function execute() {
            return new Promise(function () {})
        }
    })
})