
window.addEventListener("scroll", ()=>{
    if(window.scrollY > 0){
        document.querySelector(".nav-container").classList.add("nav-scroll");
    }
    else{
        document.querySelector(".nav-container").classList.remove("nav-scroll");
    } 
});

let currentIndex = 0;

function moveSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const slideWidth = slides[0].offsetWidth;
    const visibleSlides = window.innerWidth <= 768 ? 1 : 3;


    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = totalSlides - visibleSlides;  
    } else if (currentIndex > totalSlides - visibleSlides) {
        currentIndex = 0;  
    }
    document.querySelector('.gallery-slides').style.transform = `translateX(-${currentIndex * slideWidth}px)`;
}
document.querySelectorAll('.navbar-list a').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelector('#check').checked = false; 
    });
});
function closeResult(){
    document.getElementById('result-container').style.display = 'none'; 
}
function goToAbout(){
    window.location.href = '#about';
}
document.getElementById('submitForm').addEventListener('submit', async function(event){
    event.preventDefault(); 
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const result = await response.json();
            openModal(result); 
        } else {
            console.error("Failed to submit data");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
function openModal(data) {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = '';
    if(data.length == 0){
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = "Sorry, we couldn't find anything matching your search.";
        noDataMessage.style.color = 'black'; 
        noDataMessage.style.textAlign = 'center'; 
        cardsContainer.appendChild(noDataMessage);
    }else{
        data.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${item.location}</h3>
                <p class="title">Budget: <span>${item.estimated_budget}</span></p>
                <p class="title">Season: <span>${item.season}</span></p>
                <p class="title">Duration: <span>${item.recommended_duration}</span></p>
                <p class="title">Trip Type: <span>${item.trip_type}</span></p>
                <p class="title">Activity Level: <span>${item.activity_level}</span></p>
                <p class="title">Transport: <span>${item.transport}</span></p>
            `;
            cardsContainer.appendChild(card); 
        });
    }
    
    document.getElementById('result-container').style.display = 'flex'; 
}