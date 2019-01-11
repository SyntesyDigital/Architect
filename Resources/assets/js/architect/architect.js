//------------------------------------------//
//      BOOTSTRAP FOR ARCHITECT LIB
//      @syntey-digital - 2018
//------------------------------------------//
var architect = {

    currentUserHasRole: function(roleName) {
        var user = CURRENT_USER;

        if(!user) {
            return false;
        }

        var role = user.roles.filter(function(r){
            if(r.name == roleName) {
                return r;
            }
        });

        return role.length > 0 ? true : false;
    },

};
