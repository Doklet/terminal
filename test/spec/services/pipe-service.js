'use strict';

describe('Service: PipeService', function () {

  // load the service's module
  beforeEach(module('terminalApp'));

  // instantiate service
  var PipeService;
  beforeEach(inject(function (_PipeService_) {
    PipeService = _PipeService_;
  }));

  it('should do something', function () {
    expect(!!PipeService).toBe(true);
  });

});
