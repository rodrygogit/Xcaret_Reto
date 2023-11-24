public with sharing class CovidTracking_CC {

	public Integer positive {get;set;} 
	public Integer negative {get;set;} 
	public Integer hospitalizedCurrently {get;set;} 
	public String dateChecked {get;set;} 
	public String hash {get;set;} 


  public static void setData(){

    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint('https://api.covidtracking.com/v1/us/daily.json');
    request.setMethod('GET');
    request.setTimeout(6000);
    HttpResponse response = http.send(request);

   List<covid_tracking__c> listNewRecords = new List<covid_tracking__c>();
   List<CovidTracking_CC> listCovid = (List<CovidTracking_CC>) JSON.deserialize(response.getBody(), List<CovidTracking_CC>.class);
   for(CovidTracking_CC covid :listCovid ){
    listNewRecords.add(new covid_tracking__c(
      positive__c = covid.positive,
      negative__c = covid.negative,
      hospitalizedCurrently__c = covid.hospitalizedCurrently,
      dateChecked__c = Date.valueOf(covid.dateChecked),
      ExternalId__c = covid.hash

    ));
   }

   Database.UpsertResult[] results = Database.upsert(listNewRecords ,covid_tracking__c.ExternalId__c);
   for(Database.UpsertResult result: results){
    if(result.isSuccess()){
     System.debug('Registro modificado con Exito :: '+ result.getId());
    }else{
      System.debug('Error al insertar el registro :: '+ result.getErrors());
    }
   }
  }


@AuraEnabled
public static List<covid_tracking__c>  getRecords(){
  List<covid_tracking__c>  listRecords = new List<covid_tracking__c> ();
  try {
    listRecords = [SELECT Id,positive__c,negative__c,hospitalizedCurrently__c,dateChecked__c FROM covid_tracking__c ORDER BY  hospitalizedCurrently__c DESC Limit 10000];
  } catch (Exception e) {
    throw new AuraHandledException(e.getMessage());
  }
  return listRecords;
}


@AuraEnabled
public static void  deleteItem(String recordId){
  try {
    covid_tracking__c  deleteItem = [SELECT Id,positive__c,negative__c,hospitalizedCurrently__c,dateChecked__c FROM covid_tracking__c WHERE Id=: recordId];
     delete deleteItem;
  } catch (Exception e) {
    throw new AuraHandledException(e.getMessage());
  }
}


}