const GethMethod = async(url)=>{
    try{
        const response = await fetch(url);
        if(!response.ok){
            throw new Error("GET hiba: ",response.status);
        }
        return await response.json();
    }catch(error){
        throw new Error("GET hiba: ", error.message);
    }
};


document.addEventListener('DOMContentLoaded', async()=>{
    selectFeltolt();

    document.getElementById('select').addEventListener('change', async(event)=>{
        selectKivalaszt(event.target.value);
    });

    document.getElementById('gomb').addEventListener('click', async ()=>{
        quiz();
        document.getElementById('gomb2').addEventListener('click', async ()=>{
            ellenoriz();
        })
    })
    let p=document.createElement('p');
    let input = document.createElement('input')
    input.type = "text";
    const gomb2 = document.createElement('input');
    gomb2.type = "button";
    gomb2.value = "Ellenőrzés";
    gomb2.setAttribute("id","gomb2");
    let p2 = document.createElement('p');
    let random;
    
    const form2 = document.getElementById('form2');
    const response = await GethMethod('/api/stat');
    async function ellenoriz(){
        switch(random){
                case 0:
                    if(input.value == response.leghosszabb){
                        p2.innerText = "Helyes megoldás";
                    }else{
                        p2.innerText = "Helytelen megoldás";
                    }
                    break;
                case 1:
                    if(input.value == response.legmelyebb){
                        p2.innerText = "Helyes megoldás";
                    }else{
                        p2.innerText = "Helytelen megoldás";
                    }
                    break;
                case 2:
                    if(input.value == response.darab){
                        p2.innerText = "Helyes megoldás";
                    }else{
                        p2.innerText = "Helytelen megoldás";
                    }
                    break;
                case 3:
                    if(input.value == response.fokozottan){
                        p2.innerText = "Helyes megoldás";
                    }else{
                        p2.innerText = "Helytelen megoldás";
                    }
                    break;
            }
            form2.appendChild(p2);
    }

    async function quiz(){
        try{
            const kerdesek = ["Melyik a leghosszabb barlang?", "Melyik a legmélyebb barlang?", "Hány barlang van?", "Hány fokozottan védett barlang van?"];
            random = Math.floor(Math.random()*kerdesek.length);
            let kerdes = kerdesek[random];
            p2.innerText = "";
            input.value = "";
            
            console.log(kerdes)
            
            p.innerText = kerdes;
            

            form2.appendChild(p);
            form2.appendChild(input);
            form2.appendChild(gomb2);
            
        }catch(error){
            console.error("Hiba: ",error.message);
        }
    }

    async function selectFeltolt(){
        try{
            const select = document.getElementById('select');
            const response = await GethMethod('/api/barlangok');
            
            for(let i=0;i<response.content.length;i++){
                let opt = document.createElement('option');
                opt.innerText = response.content[i].nev;
                select.appendChild(opt);
            }
        }catch(error){
            console.error("Hiba van!");
        }
        
    }
    let li1 = document.createElement('li');
    let li2 = document.createElement('li');
    let li3 = document.createElement('li');
    let li4 = document.createElement('li');
    let li5 = document.createElement('li');
    async function selectKivalaszt(event){
        try{
            const response1 = await GethMethod('/api/barlangok');
            let j=0;
            while(j<response1.content.length && response1.content[j].nev != event){
                j++;
            }
            const ul = document.getElementById('ul');
            const p = document.getElementById('p');
            const response2 = await GethMethod(`/api/barlang/${response1.content[j].azon}`);
            p.innerText ="nev: "+ response2.barlang.nev;
            
            li1.innerText ="azon: "+ response2.barlang.azon
            
            li2.innerText ="hossz: "+ response2.barlang.hossz;
            
            li3.innerText = "melyseg: "+ response2.barlang.melyseg;
            
            li4.innerText = "telepules: "+response2.barlang.telepules;
            
            li5.innerText ="vedettseg: "+ response2.barlang.vedettseg;

            ul.appendChild(li1);
            ul.appendChild(li2);
            ul.appendChild(li3);
            ul.appendChild(li4);
            ul.appendChild(li5);
        }catch(error){
            console.error("Hba van: ", error.message);
        }
    }
})