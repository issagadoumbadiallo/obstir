(function () {
    var compte=window.localStorage.getItem("TypeCompteObstir")

    if (compte==="agent") {
        window.location.href = './agent/index.html';
        } 
    else if (compte==="entreprise") {
            window.location.href = './entreprise/index.html';
            }
    else {
        window.location.href = 'oauth.html';
        };
}());