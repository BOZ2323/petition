



app.post("/login", (req, res) => {
    database
        .dbPassword(req.body.email)
        .then(dbPass => {
            return database.checkPassword(req.body.password, dbPass);
        })
        .then(answer => {
            if (answer) {
                console.log("THE ANSWER: ", answer);
                database.getUserId(req.body.email).then(result => {
                    req.session.user = result;
                    res.redirect("/");
                });
            } else {
                console.log("ERROR: PASSWORD DOESN'T MATCH");
                res.render("login", {
                    layout: "main",
                    title: "PETITION",
                    error: "error"
                });
            }
        })



Au
