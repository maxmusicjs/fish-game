//Canvas setup
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d')//контекст переданя  2D Плотна
canvas.width = 800; //ширина полотна
canvas.height = 500;//висота плотна

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia'; //розмір шрифта

//Mouse Interactivity
//getBoundingClientRect повертає обєкт що надає інформацію про розмір елемента та його положення відносно вікна
let canvasPosition = canvas.getBoundingClientRect();


const mouse = {
    x: canvas.width/2,//ширина поділина на два   
    y:  canvas.height/2, //висота поділена на два
    click: false
}
//mousedown подія працює тоді коли миша нажата над елементом
//прослуховувач подій  з воротнією функцією має доступ до обєкта подій
canvas.addEventListener('mousedown',function(event){
    //аргумент що разу  коли ми калацає властивість миші у рядку 13 буде превизначено поточним х миші
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    
});
canvas.addEventListener('mouseup', function(){ //прослуховувач подій для події mouse up коли спрацьовує подія клацання миші на false  
    mouse.click = false;
})

//Player

//це конструктор
class Player{
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 50;
        this.angle = 0; // поверненнчя гравця до поточної позиції миші
        this.frameX = 0; //надає можливість рибі дивитися в ту сторону яку пливе
        this.frameY = 0;
        this.frame = 0 ;     //властивість this.frame,яка відстежуватиме загальну кількість кадрів на аркуші та поточну позицію яку ми анімуємо
        this.spriteWidth = 498; //ширина спрайта рибки
        this.spriteHeight = 327; //висота спрайта рибки

    }
    update(){
        const dx = this.x - mouse.x; //поточна позиція гравців та поточна позиція миші на горизонтальні осі
        const dy =this.y - mouse.y; //відстань повертикалі 
        if(mouse.x != this.x){ //якщо поточна позиція x миші не дорівнює пточній позиції гравця ця крапка x
            this.x -=dx/20;//швидкість зменшена анімації іграка

        }
        if (mouse.y != this.y) {
            this.y -=dy/20;//швидкість зменшена анімації
            
        }
        
    }
    draw(){
        if(mouse.click){//щоб ми могли побачити напрямок       
            ctx.lineWidth = 0,2 ; //тонка лінія 
            ctx.beginPath();//сtx переміщення новий під шлях
            ctx.moveTo(this.x, this.y,);//це поточна позиція гравця
            ctx.lineTo(mouse.x, mouse.y,);
            ctx.stroke();
        }
        //arc метод додає дугу до шляху з центром (x, y) і з радіусом r з початком у startAngle і з кінцем endAngle і з направленням проти часової стрілки 
        //(за замовчуванням по часовій стрілці).
        //створеня кола і надання йому стилю
        ctx.fillStyle = 'red';//стиль для гравця
        ctx.beginPath(); //початок нового під шляху
        ctx.arc(this.x, this.y, this.radius,0,Math.PI * 2); //метод буде помножино у 2 вийде коло 360 умова
        ctx.fill(); //метод який намалює коло
        ctx.closePath() //закривання шляху

    }

    
}
const player = new Player();//ключове слово
//lineTo додає лінію до текучого шляху з кінцевою точкою з координатами (x, y).
//Сам метод нічого не рисує, він лише додає підхід до поточного шляху, надаючи його таким методам, як fill()і stroke(),
//Bubbles
const BubblesArray = [];
class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100 ;
        this.radius = 50;
        this.speed = Math.random()* 5 + 1;
        this.distance; 
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        //тернатний оператор звуку на бульбашки 
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        //Статичний Math.sqrt()метод повертає квадратний
        this.distance = Math.sqrt(dx* dx + dy *dy);
    }
    draw(){
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();


    }
    }

    const bubblePop1 = document.createElement('audio');
    bubblePop1.src = 'music/pop1.ogg';
    const bubblePop2 = document.createElement('audio');
    bubblePop2.src = 'music/pop2.ogg';

    function handleBubbles(){
        if(gameFrame % 50 == 0){
            BubblesArray.push( new Bubble());
           
     
         } 
         for(let i = 0; i < BubblesArray.length; i++){
          BubblesArray[i].update();
          BubblesArray[i].draw();
         
         } 
         for (let i = 0; i < BubblesArray.length; i++){//прохдження ще одним циклом для уникнення блимання і помістивши сюди сплайсинг
            if (BubblesArray[i].y < 0 - BubblesArray.radius * 2){
                BubblesArray.splice(i, 1);//доходить до сими і повторюється цикл
             }
            if(BubblesArray[i].distance < BubblesArray[i].radius + player.radius){//преревірка відстані між гравцем і буьбашкою зіднення двох кіл
                if(!BubblesArray[i].counted){//знак ! означає false
                    if(BubblesArray [i].sound == 'sound1'){
                        bubblePop1.play();//запуск звуку по умові
                    }else{
                        bubblePop2.play();
                    }
                    score++;//зідкнення призводить д виведення балів в текст балів
                    BubblesArray[i].counted = true; //це спричиння зарахуваня бульбашки лиш один раз counted це рахунок
                    BubblesArray.splice(i, 1); //видалення з масиву  всередені метода ми вказуєм індекс циклу і кількість елементі
                }
               

            }  
         } 
    }

   
 






//Animation loop
function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);//прибирання лишньої фарби між кадрами
    handleBubbles(); 
    player. update();//оновлення з рядка 49 щоб визначити позицію
    player.draw();//малювати гравця
    ctx.fillStyle = 'black';
    ctx.fillText('score:' + score, 10, 50);//текст з балами
    gameFrame++;
    requestAnimationFrame(animate);//ваказує браузеру на те що ми хочемо зробити
} 
animate(); 