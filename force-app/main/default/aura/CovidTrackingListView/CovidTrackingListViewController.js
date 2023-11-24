({
    init: function (cmp, event, helper) {
        var rowActions = helper.getRowActions.bind(this, cmp);
        cmp.set('v.columns', [
            { label: 'Date Checked', fieldName: 'dateChecked__c', type: 'date' , sortable: true,},
            { label: 'Positve', fieldName: 'positive__c', type: 'number' },
            { label: 'Negative', fieldName: 'negative__c', type: 'number' },
            { label: 'Hospitalized Currently', fieldName: 'hospitalizedCurrently__c', type: 'number' },
            { type: 'action', typeAttributes: { rowActions: rowActions } }
        ]);
        helper.fetchData(cmp);
    },

    handleRowAction: function (cmp, event, helper) {
        cmp.set("v.loaded", false);
        var row = event.getParam('row');
        console.log(row);
        helper.removeCovidTrack(cmp,row);
    },

    handleSort: function(cmp, event, helper) {
        helper.handleSort(cmp, event);
    }

});
