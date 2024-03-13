({
    sendError : function() {
        this.showToast({
            "title": $A.get('$Label.c.ALL_Error'),
            "message": $A.get('$Label.c.ALL_Generic_Error'),
        });
    },

    getCallerReference : function(component) {
        component.find('debugger').debug('[SalesCreateOpportunityFlowLauncherHelper.getRefContext] start');
        var pageRef = component.get('v.pageReference');
        if (pageRef && pageRef.state) {
            var state = pageRef.state;
            if (state && state.inContextOfRef) {
                var base64Context = state.inContextOfRef;
                if (base64Context.substr(0, 2) === "1\.") {
                    base64Context = base64Context.substring(2);
                }
                return JSON.parse(window.atob(base64Context));
            }
        }

        return null;
    },
});