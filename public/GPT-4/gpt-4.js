const d = document;

function $(id) {
    return d.querySelector(id)
}

let container, submit, inputText, theme;

container = $('.chat-container');
submit = $('#btn-send');
inputText = $('#input-text');

theme = $('#theme');

var moon = false;

console.log('Moon: '+moon)

theme.onclick = () => {


        $('body').classList.toggle("dark-mode");

        inputText.classList.toggle("dark-mode-child")
        submit.classList.toggle("dark-mode-child")
        $('#btn-clear').classList.toggle("dark-mode-child")

        if (moon == false) {
            $('#svgSun').classList.toggle("animation")
            $('#svgSun').style.color = 'silver'
            $('#svgSun').innerHTML = `<svg id="svgSun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16">
                                     <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
                                      </svg>`

            moon = true

        } else {
            $('#svgSun').classList.toggle("animation")
            $('#svgSun').style.color = 'black'
            $('#svgSun').innerHTML = `<svg id="svgSun" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
            <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
        </svg>`

            moon = false
        }
    }

function pageScroll() {
        window.scrollBy(0,10);
}

window.onload = () => {
    inputText.focus();
    localStorage.clear()
    storeUser()
}

function question(text) {
    let div = d.createElement('div');
    div.className = 'message-sent';

    // this for user imgae 

    let circleParent = d.createElement('div');
    circleParent.className = 'circle-parent';

    let circleChild = d.createElement('div');
    circleChild.className = 'circle-sent';

    circleParent.appendChild(circleChild);
    div.appendChild(circleParent);

    let p = d.createElement('p')
    p.innerText = text

    div.appendChild(p)
    container.appendChild(div)
}

function answer(text) {
    let div = d.createElement('div');
    div.className = 'message-sent';

    // this for user imgae 

    let circleParent = d.createElement('div');
    circleParent.className = 'circle-parent';

    let circleChild = d.createElement('div');
    circleChild.className = 'circle-sent-recive';

    circleParent.appendChild(circleChild);
    div.appendChild(circleParent);


    let p = d.createElement('p');
    p.id = 'p-response'

    let originT = text;

    const onJs = originT.replace(/```([\s\S]+?)```/g, '<pre id="code-output" class="language-js"><code>$1</code></pre>');

    let newText = onJs.replace(/\n/g, "<br />")

   /* const regex = /```([\s\S]*?)```/g;

    const matches = text.match(regex);

    */
    

    div.appendChild(p);
    container.appendChild(div);

 /* if (matches) {

        let pText = $('#p-response').textContent

        console.log(pText)
        for (let index = 0; index < matches.length; index++) {
            const element = matches[index];
            
           console.log(element.split('```')[1])
        }

    } else {
        console.log('No js Found')
    }

*/

    var typed = new Typed(p, {
        strings: [newText],
        typeSpeed: 5,
        smartBackspace: true,
        showCursor: false,
        html: false
      });

      storeUser()
}



let a = []
submit.onclick = sendAnswer

function sendAnswer() {

    const isEmpty = str => !str.trim().length;

    if( isEmpty(inputText.value) ) {
       return
    } 

    question(inputText.value);
    let textStore = inputText.value; // current input value
    inputText.value = ''; // set input value

    let data = {role: 'user', content: textStore}
    a.push(data)
    localStorage.setItem('messages', JSON.stringify(a))

    $('#btn-clear').style.display = "block"
    sendQuestiontoBackend()
    // sendQuestiontoBackendv1(textStore)
}

$('#btn-clear').onclick = clearMessage

function clearMessage() {
    container.innerHTML = '';
    localStorage.clear();
    $('#btn-clear').style.display = "none";
}




async function sendQuestiontoBackend() {

    let dataV1 = localStorage.getItem('messages')
    let body = {messages: JSON.parse(dataV1), ip: localStorage.getItem('user')}
    const options = {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(body)
    }


   const url = await fetch('/back-end/api/gpt-4',options)
   const res = await url.json() 

    const AIresponseText = res.choices[0].message.content
    const dataV2 = {role: res.choices[0].message.role, content: AIresponseText}

    a.push(dataV2)
    localStorage.setItem('messages', JSON.stringify(a))

    answer(AIresponseText)
}

function storeUser() {
    fetch('https://api.surfshark.com/v1/server/user')
    .then(r => r.json())
    .then(res => {
        localStorage.setItem('user', res.ip)
        getIPuser(localStorage.getItem('user'))
    })  
}

async function getIPuser(ip) {

    const options = {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ip: ip})
    }

    const url = await fetch('/getUserInfo', options)
    const res = await url.json()

    

    $('#userBalance').innerHTML = `<p> You have ${res.userInfo.message} tokens left.`

    if (res.userInfo.message == 0) {
        $('#input-text').style.opacity = '0.5';
        $('#input-text').disabled = true;
        $('#input-text').readonly;
        $('#input-text').placeholder = 'Insufficient tokens.';

        $('#btn-send').style.opacity = '0.5';
        $('#btn-send').disabled = true;
        $('#btn-clear').style.opacity = '0.5';
        $('#btn-clear').disabled = true;

    }
}