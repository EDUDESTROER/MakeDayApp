export function createUserSession(req, res, user){

    req.session.regenerate((err)=>{

        if(err) {

            return res.status(401).json({
                gravity: 10,
                error: 'Internal server error: Unable to log in.'
            });

        }

        req.session.user = user;
        req.session.loginTime = Date.now();
        req.session.lastActivity  = Date.now();
        req.session.ip = req.ip;
        req.session.userAgent = req.headers['user-agent'];

        return res.json({ redirectUrl: '/workspace' });

    });

}
export function deleteUserSession(req, res){

    req.session.destroy((err)=>{

        if(err){

            return {
                error: 'Unable to terminate session.'
            };

        }

        return {
            success: true,
            redirectUrl: '/'
        }


    });

}