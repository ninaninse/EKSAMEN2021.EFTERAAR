// Alle buttons angivet nedenfor
document.addEventListener("DOMContentLoaded", (event) => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
        document.getElementById("update").hidden = false;
        document.getElementById("delete").hidden = false;
        document.getElementById("logOut").hidden = false;
        document.getElementById("title").hidden = false;
        document.getElementById("price").hidden = false;
        document.getElementById("category").hidden = false;
        document.getElementById("titlenew").hidden = false;
        document.getElementById("pricenew").hidden = false;
        document.getElementById("categorynew").hidden = false;
        document.getElementById("list_item").hidden = false;
        document.getElementById("filetoupload").hidden = false;
        document.getElementById("submitItem").hidden = false;

    } else {
        document.getElementById("update").hidden = true;
        document.getElementById("delete").hidden = true;
        document.getElementById("logOut").hidden = true;
        document.getElementById("title").hidden = true;
        document.getElementById("price").hidden = true;
        document.getElementById("category").hidden = true;
        document.getElementById("list_item").hidden = true;
        document.getElementById("titlenew").hidden = true;
        document.getElementById("pricenew").hidden = true;
        document.getElementById("categorynew").hidden = true;
        document.getElementById("filetoupload").hidden = true;
        document.getElementById("submitItem").hidden = true;

    }

    // Brugernes login informationer, herunder email og password.
    document.getElementById("logIn").addEventListener("click", (event) => {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        const user = {
            email,
            password
        }
        
        // Herved gemmes brugernes login/register informationer via json.stringify
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) {

                    sessionStorage.setItem("userId", response);
                    sessionStorage.setItem("email", email);
                    location.href = "/index.html";
                }
            })
            .catch(() => {
                window.alert("Der skete en fejl");
            });
    })
    
    // Nedenfor ses det, at brugerens data er blevet gemt vha. metoden post
    document.getElementById("register").addEventListener("click", (event) => {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;

        const user = {
            email,
            password
        }
        
        fetch("http://localhost:3000/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) {
                    window.alert("user data added successfully");
                }
            })
            .catch(() => {
                window.alert("Der skete en fejl");
            });
    })

    // Brugerens informationerne kan herved opdateres vha. metoden put
    document.getElementById("update").addEventListener("click", (event) => {
        let email = document.getElementById("email").value;
        let password = document.getElementById("password").value;
        const user = {
            email,
            password
        }

        fetch("http://localhost:3000/user/" + userId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) {
                    window.alert("user data updated successfully");
                }
            })
            .catch(() => {
                window.alert("Something went wrong");
            });
    })

    // Nu kan brugerens også slette deres bruger vha. metoden delete
    document.getElementById("delete").addEventListener("click", (event) => {
        console.log('clicked');

        fetch("http://localhost:3000/user/" + userId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(async (response) => {
                const body = await response.json();
                console.log(body);
                if (response) {
                    window.alert("user data deleted successfully");
                    sessionStorage.removeItem("userId");
                }
            })
            .catch(() => {
                window.alert("Something went wrong");
            });
    })
    document.getElementById("logOut").addEventListener("click", (event) => {
        sessionStorage.removeItem("userId");
        document.location.reload();
    })

    // Nedenfor bliver brugerens varer oprettet via metoden post
    document.getElementById("list_item").addEventListener("click", (event) => {
        let email = sessionStorage.getItem("email");
        let category = document.getElementById("category").value;
        let dataToSent = {email,category};
        fetch("http://localhost:3000/itemcatogery", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSent),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response) {
                    tableFromJson(response);           
                }
            })
            .catch(() => {
                window.alert("Der skete en fejl");
            });
    })    
});

// Nedenfor angives item table
function tableFromJson(myData) {

    var col = [];
    for (var i = 0; i < myData.length; i++) {
        for (var key in myData[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // Her bliver kategori menuen oprettet
    var table = document.createElement("table");

    // Kategori menuen headeren oprettes ved brug af den ekstraherede overskift ovenfor
    var tr = table.insertRow(-1);                   // kategori menu (table) row

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // kategori menu (table) header
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // Herved tilføjes json data til menuen som en række 
    for (var i = 0; i < myData.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = myData[i][col[j]];
        }
        var tabCell = tr.insertCell(-1);
        let updateButton = document.createElement("button");
        updateButton.id =myData[i][col[3]];
        updateButton.innerHTML = "update";                       // Knappen gør det muligt at opdatere en vare
        updateButton.onclick = function() {
            updateItem(updateButton.id );
        }
        tr.appendChild(updateButton)
        var tabCell = tr.insertCell(-1);
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "delete";                      // Knappen gør det muligt at slette en vare
        deleteButton.onclick = function() {
            deleteItem(updateButton.id);
        }

        tr.appendChild(deleteButton)
    }

    // Nu tilføjes den nye tabel med json data til en container 
    var divShowData = document.getElementById('showData');
    divShowData.innerHTML = "";
    divShowData.appendChild(table);
    
}

// Nedenfor angives delete funktionen via metoden delete
function deleteItem(itemId){
console.log(itemId);
var userId = sessionStorage.getItem("email");
const user = {userId};
fetch("http://localhost:3000/item/" + itemId, {
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
    },body: JSON.stringify(user)
})
    .then(async (response) => {
        const body = await response.json();
        console.log(body);
        if (response) {
            window.alert("item data deleted successfully");           
        }
    })
    .catch(() => {
        window.alert("Something went wrong");
    });
}

// Nedenfor angives funktionen for at opdatere varer via metoden put
function updateItem(itemId){
    console.log(itemId);
    let title = document.getElementById("title").value;
    let price = document.getElementById("price").value;
    let category = document.getElementById("category").value;
    let userId = sessionStorage.getItem("email");
    var data = {"category":category,"title":title,"price":price,"newItemId":itemId,"userId":userId};
fetch("http://localhost:3000/item/" + itemId, {
    method: "PUT",
    headers: {
        "Content-Type": "application/json",
    },body: JSON.stringify(data)
})
    .then(async (response) => {
        const body = await response.json();
        console.log(body);
        if (response) {
            window.alert("item data update successfully");           
        }
    })
    .catch(() => {
        window.alert("Something went wrong");
    });
    }

    // Nedenfor gemmes data fra email id'et, da man skal kunne se, hvilken bruger har postet en bestemt vare
    function submitData(){
    
        document.getElementById('emailTosubmit').value=sessionStorage.getItem("email");
    }