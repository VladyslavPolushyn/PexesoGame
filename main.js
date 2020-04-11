window.onload = function (){
  // localStorage.clear();
  let game = {
    level: {
      easy: 1500,
      medium: 1100,
      hard: 600
    },
    cards: {
      count: 36
    }
  }
  
  // let current_time = localStorage.getItem('h') + ":" + localStorage.getItem('m') + ":" + localStorage.getItem('s');
  // first_time.innerHTML = current_time;

  let startBlock = document.querySelector(".game-start-block");
  let newGameBlock = document.querySelector(".new-game-block");
  let levelButtons = document.querySelectorAll(".btn-level");
  let newGameButton = document.querySelector(".btn-new-game");
  let cardList = document.querySelectorAll(".card-box__item");
  let noClickBlock = document.querySelector(".no-click-block");
  let winnerText = document.querySelector(".winner");
  let resultPlaceArr = document.querySelectorAll(".result-fix");
  // Timer variables
  let timer;
  let full_time; //"00:01:23"
  const hours = document.getElementById('hours');
  const mins = document.getElementById('mins');
  const secs = document.getElementById('secs');
  const final_hours = document.getElementById('final-hours');
  const final_mins = document.getElementById('final-mins');
  const final_secs = document.getElementById('final-secs');
  let S = '00', M = '00', H = '00';

  sortWinTime();

  let colors = ['red', 'blue', 'green', 'black', 'yellow', 'cyan', 'brown', 'orange', 'pink', 'white', 'purple', 'navy', 'lime', 'violet', 'coral', 'gray', 'chocolate', 'wheat'];
  let images = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];
  //Из массивов делаем массивы для игры
  let colorsFullArr = getFullArr(colors);
  let imagesFullArr = getFullArr(images);

  let currentLevel;
  let correctCardsOpen = 0;

  // текущее рандомное число
  let randomNumber;
  // Массив куда будем помещать рандомные числа
  let randomNumberArr = [];
  // Переключатель когда пара открыта
  let double_switch = 0;
  // счетчик для добавления случайных чисел по 2 раза
  let two_in_array = 0;
  // Массив для двух сравниваемых карт
  let stepArr = [];
  let currentAnswerArr = [];

  levelButtons.forEach(function(element) {
    element.onclick = function(){
      startTime();
      if(element.name == "easy"){
        currentLevel = game.level.easy;
      }else if(element.name == "medium"){
        currentLevel = game.level.medium;
      }else if(element.name == "hard"){
        currentLevel = game.level.hard;
      }
      toggleClass(startBlock, "no-display");

      // startGame(currentLevel);
    }
  });


  cardList.forEach(function(element) {
    // Сразу добавим класс но-колор, чтобы перекрыть присвоившиеся классы с цветами (Класс но-колор должен быть ниже классов цвета в css файле!)
    
    // Скрываем цвета
    addClass(element, "no-color");
    // скрываем картинки
    addClass(element, "no-img");


    // массив из рандомных чисел (0, количество карт - 1)
    do{
      randomNumber = getRandom(0, game.cards.count - 1);
    }while( randomNumberArr.includes(randomNumber) );

    randomNumberArr.push(randomNumber);
    
    // Добавляем цвет элементу
    element.classList.add(colorsFullArr[randomNumber]);
    // Добавляем картинку элементу
    element.style.backgroundImage = `url("img/${imagesFullArr[randomNumber]}.png")`;

    element.onclick = function() {
      // если карта перевернута, то не давать кликать по ней
      if( this.classList.contains("no-color") ){
        // Переключатель, чтобы понимать, что пара карт открыта
        double_switch += 1;
        
        toggleClass(this, "no-color");
        toggleClass(this, "no-img");

        // каждый круг обнуляем массив с парой
        if( (stepArr.length == 2) ){
          stepArr = [];
        }
        stepArr.push(this);

        // ПРОВЕРКА НА СОВПАДЕНИЕ
        if( (stepArr[0].classList.value == stepArr[1].classList.value) && (stepArr.length != 0) ){
          // Если совпали, то ничего не делаем
          // Не переворачиваем и сразу можно приступать к след. клику
          currentAnswerArr.push(stepArr[0], stepArr[1]);
          // счетчик открытых карт для проверки на победу
          correctCardsOpen += 2;
        }else{

          if(double_switch % 2 == 0){
            noClick();
            setTimeout(function(){
              cardList.forEach(function(elem){
                addClass(elem, "no-color");
                addClass(elem, "no-img");
              });
              currentAnswerArr.forEach(function(elem) {
                removeClass(elem, "no-color");
                removeClass(elem, "no-img");
              });
              noClick();
            }, currentLevel);
          }

        }
      } 
      // проверка на выигрыш
      if(correctCardsOpen === game.cards.count){
        clearInterval(timer);
        toggleClass(newGameBlock, "no-display");
        toggleClass(winnerText, "no-display");
        localStorage.setItem(full_time, full_time);

        // sortWinTime();
      }
    }

  });


  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

  function noClick(){
    noClickBlock.classList.toggle("no-click");
  }

  function addClass(elem, className){
    elem.classList.add(className);
  }

  function removeClass(elem, className) {
    elem.classList.remove(className);
  }

  function toggleClass(elem, className) {
    elem.classList.toggle(className);
  }

  function getFullArr(arr) {
    let arr_copy = arr.slice();
    let full_arr = arr.concat(arr_copy);
    // можно дополнительно перемешать массив
    // Нельзя (тогда не совпадут цвета и картинки)
    // shuffleArr(full_arr);
    return full_arr;
  }

// ФУНКЦИЯ ПЕРЕМЕШИВАНИЯ МАССИВА НА ВСЯКИЙ СЛУЧАЙ

  function shuffleArr(arr){
    let j, temp;
    for(let i = arr.length - 1; i > 0; i--){
      j = Math.floor(Math.random()*(i + 1));
      temp = arr[j];
      arr[j] = arr[i];
      arr[i] = temp;
    }
    return arr;
  }

  function startTime(){
   timer = setInterval(function(){
      //Плюсик перед строкой преобразует его в число
      S = +S +1;
      //Если результат меньше 10, прибавляем впереди строку '0'
      if( S < 10 ) { S = '0' + S; }
      if( S == 60 ) {
        S = '00';
        //Как только секунд стало 60, добавляем +1 к минутам
        M = +M + 1;
        //Дальше то же самое, что и для секунд
        if( M < 10 ) { M = '0' + M; }
        if( M == 60 ) {
          //Как только минут стало 60, добавляем +1 к часам.
          M = '00';
          H = +H + 1;
          if( H < 10 ) { H = '0' + H; }
        }
      }
      secs.innerText = final_secs.innerText = S;
      mins.innerText = final_mins.innerText = M;
      hours.innerText = final_hours.innerText = H;
      full_time = H + ":" + M + ":" + S;

      //Тикает всё через одну функцию, раз в секунду.
    },1000);
    
  };


  function sortWinTime() {
    let resultArr = [];

    for(let i = 0; i < localStorage.length; i++){
      let key = localStorage.key(i);
      resultArr.push(localStorage.getItem(key));
    }

    resultArr.sort();

    let i = 0;
    resultPlaceArr.forEach(function(elem){
      if(resultArr[i] === undefined){
        elem.innerHTML = "__:__:__";
      }else{
        elem.innerHTML = resultArr[i++];
      }
    });

    console.log(resultArr);
  }

}