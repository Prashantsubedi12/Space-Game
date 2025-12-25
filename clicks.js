/* --- PART 1: STARFIELD BACKGROUND --- */
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

class Star {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Slight gravity pull towards center
        const centerX = width / 2;
        const centerY = height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Gravity gets stronger closer to center
        if(dist < 300) {
            this.x += dx * 0.005;
            this.y += dy * 0.005;
        }

        // Reset if out of bounds or sucked in too close
        if (dist < 20 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random()})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create 200 stars
for(let i=0; i<200; i++) stars.push(new Star());

function animateStars() {
    ctx.clearRect(0, 0, width, height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animateStars);
}
animateStars();


/* --- PART 2: THE CONSUMPTION ENGINE --- */

function feedTheVoid() {
    const input = document.getElementById('sacrificeInput');
    const text = input.value;
    
    if(!text) return;

    // Create a floating element for the text
    const element = document.createElement('div');
    element.innerText = text;
    element.style.position = 'absolute';
    element.style.color = '#fff';
    element.style.fontSize = '2rem';
    element.style.fontWeight = 'bold';
    element.style.textShadow = '0 0 10px #ff0055';
    
    // Start position (random spot on screen)
    const startX = Math.random() * (width - 100);
    const startY = Math.random() * (height - 100);
    
    element.style.left = `${startX}px`;
    element.style.top = `${startY}px`;
    
    document.body.appendChild(element);
    input.value = ''; // Clear input

    // Wait a split second, then suck it in
    setTimeout(() => {
        consumeElement(element);
    }, 100);
}

function consumeElement(el) {
    // 1. Get Black Hole Coordinates
    const bh = document.getElementById('singularity').getBoundingClientRect();
    const bhX = bh.left + bh.width / 2;
    const bhY = bh.top + bh.height / 2;

    // 2. Add transition class
    el.classList.add('sucked-in');

    // 3. Apply the Spaghettification Transform
    // We move it to the center AND rotate/scale it wildly
    el.style.transform = `
        translate(${bhX - parseFloat(el.style.left)}px, ${bhY - parseFloat(el.style.top)}px) 
        rotate(720deg) 
        scale(0.1, 4)
    `;
    el.style.opacity = '0';
    el.style.filter = 'blur(10px)';

    // 4. Remove from DOM after animation
    setTimeout(() => {
        el.remove();
    }, 1500);
}


/* --- PART 3: THE FINAL COLLAPSE (Theme: 最終的に消えるモノ) --- */

function triggerCollapse() {
    // 1. Select ALL elements on the page (UI, titles, buttons)
    const allElements = document.querySelectorAll('.ui-layer > *');
    
    let delay = 0;
    
    // Suck everything in one by one
    allElements.forEach(el => {
        setTimeout(() => {
            // Need to make them absolute positioned to animate properly if they aren't already
            const rect = el.getBoundingClientRect();
            el.style.position = 'absolute';
            el.style.left = rect.left + 'px';
            el.style.top = rect.top + 'px';
            el.style.margin = '0';
            
            consumeElement(el);
        }, delay);
        delay += 300;
    });

    // Finally, the black hole eats itself
    setTimeout(() => {
        const disk = document.querySelector('.accretion-disk');
        const hole = document.querySelector('.black-hole');
        
        disk.style.transition = "all 2s";
        disk.style.transform = "scale(0)";
        
        hole.style.transition = "all 0.5s";
        hole.style.transform = "scale(0)"; // Implosion
        
        // Final fade to absolute nothingness
        setTimeout(() => {
            document.body.style.transition = "background 3s";
            document.body.style.background = "#000000";
            canvas.style.opacity = '0'; // Stars fade out
        }, 1000);

    }, delay + 1000);
}

// Allow "Enter" key to submit
document.getElementById('sacrificeInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        feedTheVoid();
    }
});