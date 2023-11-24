@IsTest
public class HTTPMockFactory implements HttpCalloutMock {
  protected Integer code;
  protected String status;
  protected String body;
  public HTTPMockFactory(
    Integer code,
    String status,
    String body ) {
    this.code = code;
    this.status = status;
    this.body = body;
  }
  public HTTPResponse respond(HTTPRequest req) {
    HttpResponse res = new HttpResponse();

    res.setBody(this.body);
    res.setStatusCode(this.code);
    res.setStatus(this.status);
    return res;
  }
}