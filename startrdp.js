var cred = require("rdpcred");
var exec = require('child_process').exec;

function usage()
{
    console.log(`startrdp - Node.js script to autologin mstsc connections
    See www.flydesktop.com for more information
    Usage: node startrdp.js [/d:domain] /u:<user> /p:<password> /v:<server>
    
    Syntax:
    /u:<value> username
    /p:<value> user password
    /d:<value> optional domain
    /v:<value> server hostname`);
}

var argv = process.argv.slice(2);
if(argv.length < 3) {
    usage();
    process.exit(1);
}
var hostname = '';
var username = '';
var password = '';
var domain = '';
argv.forEach(function(arg){
    if (arg.startsWith('/v:'))
        hostname = arg.substr(3);
    if (arg.startsWith('/u:'))
        username = arg.substr(3);
    if (arg.startsWith('/d:'))
        domain = arg.substr(3);
    if (arg.startsWith('/p:'))
        password = arg.substr(3);
});

if(hostname.length == 0 || username.length == 0 || password.length == 0) {
    usage();
    process.exit(1);
}

var opts = {
        service: "TERMSRV/" + hostname,
        account: (domain.length)?domain + "\\" + username: username,
        password: password
    };
    
cred.setCredentials(opts,function(err) {
    if(err) {
        console.log(err);
    } else {
        exec('mstsc /v:' + hostname, function callback(error, stdout, stderr) {
            delete opts.password;
            cred.deleteCredentials(opts, function(err) {
                if(err)
                    console.log(err);
            });
        });
    }
});


