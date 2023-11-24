({
    fetchData: function (cmp) {

        var action = cmp.get("c.getRecords");
        //action.setParams({ firstName : cmp.get("v.firstName") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.data", response.getReturnValue());
                console.log(response.getReturnValue());
                cmp.set("v.loaded", true);
                
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    getRowIndex: function(rows, row) {
        var rowIndex = -1;
        rows.some(function(current, i) {
            if (current.id === row.id) {
                rowIndex = i;
                return true;
            }
        });
        return rowIndex;
    },
    removeCovidTrack: function (cmp, row) {
        var action = cmp.get("c.deleteItem");
        action.setParams({ "recordId" : row.Id });
        action.setCallback(this, function(response) {
            var state = response.getState();
            cmp.set("v.loaded", true);
            if (state === "SUCCESS") {
                 $A.get('e.force:showToast').setParams
                ({
                "title": "Exito",
                "message": "Registro eliminado correctamente!",
                "type": "success",
                }).fire();
                this.fetchData(cmp);
            }
            else if (state === "ERROR") {
                $A.get('e.force:showToast').setParams
                ({
                "title": "Ha ocurrido un error",
                "message": "Contacta  a tu administrador de Salesforce.",
                "type": "error",
                }).fire();
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
   
    getRowActions: function (cmp, row, doneCallback) {
        var actions = [];
        var deleteAction = {
            'label': 'Delete',
            'iconName': 'utility:delete',
            'name': 'delete'
        };
        actions.push(deleteAction);
        // simulate a trip to the server
        setTimeout($A.getCallback(function () {
            doneCallback(actions);
        }), 200);
    },


    // Used to sort the 'Age' column
    sortBy: function(field, reverse, primer) {
        var key = primer
            ? function(x) {
                  return primer(x[field]);
              }
            : function(x) {
                  return x[field];
              };

        return function(a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    },

    handleSort: function(cmp, event) {
        var sortedBy = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        var listRecords = cmp.get("v.data");
        var cloneData = listRecords.slice(0);
        cloneData.sort((this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1)));
        
        cmp.set('v.data', cloneData);
        cmp.set('v.sortDirection', sortDirection);
        cmp.set('v.sortedBy', sortedBy);
    }
});
