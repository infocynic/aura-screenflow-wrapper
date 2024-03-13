({
    onInit : function(component, event, helper) {
        var parameters = [];
        var parentRecordId = null;

        // get parent id, if there is one
        // from Pascal Le Clech on https://developer.salesforce.com/forums/?id=9060G000000UaqdQAC
        var context = helper.getCallerReference(component);

        // try to unpack to make IE happy...
        var hasContext = context !== null;
        hasContext = hasContext && context.attributes;
        hasContext = hasContext && context.attributes.recordId;
		
		//if you only want this to work from certain parent objects you can uncomment and tweak this line
        //hasContext = hasContext && context.attributes.objectApiName === 'Account';

        if (hasContext) {
            parentRecordId = context.attributes.recordId;
            component.set("v.parentRecordId", parentRecordId);
            parameters.push({
                name: 'relatedRecordId',
                type: 'String',
                value: parentRecordId,
            });
        }

        var flow = component.find("flow");
        flow.startFlow("FL_SCR_Sales_Opportunity_NewOpportunity", parameters);
    },

    onPageReferenceChange : function(component, event, helper) {
        // we have to call the function on the component because 'this' is v.pageReference
        // and in order to do that, we have to expose it via
        // <aura:method name="reInit" action="{!c.handleOnInit}" access="public" />
        component.reInit();
    },

    onFlowStatusChange : function (component, event, helper) {
        if ( event.getParam( "status" ).indexOf( "FINISHED" ) !== -1 ) {
            var outputVars = event.getParam('outputVariables');
            var record = null;
            outputVars.forEach(function(outVar) {
                if (outVar.name === 'record') {
                    record = outVar.value;
                }
            });

            if (record === null) {
                helper.sendError();
            }

            var onComplete = component.get('v.onComplete');
            if (onComplete) {
                component.handleOnComplete();
            }

			//if you don't want to navigate to the new record, comment out from here...
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": opportunity.Id,
            });
            navEvt.fire();
			//...to here.
        }
    }
});