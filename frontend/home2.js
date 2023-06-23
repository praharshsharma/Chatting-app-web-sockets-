
function sendData() {
    const e = document.getElementById('search-box').value;
    // console.log(e);
    const data = { payload: e };
    const searchresults = document.getElementById('searchResults');
    let match1 = e.match(/^[a-zA-Z]*/);
    let match2 = e.match(/\s*/);
    if(match2[0]===e){
        searchresults.innerHTML='';
        return;
    }
    if(match1[0] === e){
        fetch("/getf", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(res => res.json()).then(data => {
            let payload = data.payload;
            searchresults.innerHTML = '';
            if (payload.length < 1) {
                searchresults.innerHTML = '<p>Sorry. Nothing found.</p>';
                return;
            }
            payload.forEach((item, index) => {
                if (index > 0) searchresults.innerHTML += '<hr>';
                searchresults.innerHTML += `<p>${item.name}</p>`;
            });
        });
        return;
    }
    searchresults.innerHTML='';
}