'use strict'
document.addEventListener('DOMContentLoaded', () => {

    const tab = document.querySelectorAll(".tabheader__item"),  
          tabItem = document.querySelector(".tabheader__items"),                     
          tabContent = document.querySelectorAll(".tabcontent");
    function hideTabContent(){
        tabContent.forEach(el => {
            el.classList.add("hide");
            el.classList.remove("show");
        });
        tab.forEach(el => {
            el.classList.remove("tabheader__item_active");
        });
    }
    function showTabContent(i = 0){
        tabContent[i].classList.add("show");
        tabContent[i].classList.remove("hide");
        tab[i].classList.add("tabheader__item_active");
    }
    hideTabContent();
    showTabContent();
    tabItem.addEventListener('click', (event) => {
        const target = event.target;
        if(target && target.classList.contains("tabheader__item")) {
            tab.forEach((el, i) => {
                if(target == el){
                    hideTabContent();
                    showTabContent(i);

                }
            });
        }
    });

    //TIMER
    const deadline = '2021-12-30';
    function getTime(endtime){
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t/(1000*60*60*24)),
              hours = Math.floor(t/(1000*60*60)%24),
              min = Math.floor(t/(1000*60)%60),
              sec = Math.floor((t/1000)%60);

        return{
            'total':t,
            'days':days,
            'hours':hours,
            'min':min,
            'sec':sec
        };
    }
    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

              updateClock();
        //приписывает "0" к числам меньше "10"
        function getZero(num){
            if(num >= 0 && num < 10){
                return `0${num}`;
            } else {
                return num;
            }
        }
        function updateClock(){
            const t = getTime(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.min);
            seconds.innerHTML = getZero(t.sec);
            if(t.total <= 0){
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);


    //MODAL

    const btns = document.querySelectorAll('[data-modal]'), 
          modal = document.querySelector('.modal'),
          modalClose = document.querySelector('[data-close]');


    function openModal(){
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';//чтобы при скроле не происходила промотка
        clearInterval(modalTimer);
    }
    function closeModal(){
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    btns.forEach(el => {
        el.addEventListener('click', openModal);
    });

    

    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (el) => {
        if(el.target === modal){
            closeModal();
        }
    });

    document.addEventListener('keydown', (el) => {
        if(el.code === "Escape"){
            closeModal();
        }
    });
    const modalTimer = setTimeout(openModal, 3000);

    function snowModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', snowModalByScroll);
        }
    }

    window.addEventListener('scroll', snowModalByScroll);


//SLIDER
    const slider = document.querySelectorAll('.offer__slide'),
          nextSlider = document.querySelector('.offer__slider-next'),
          prevSlider = document.querySelector('.offer__slider-prev'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current');
    let index = 1;
    
    showSlider(index);
    if (slider.length < 10) {
        total.textContent = `0${slider.length}`;
    } else {
        total.textContent = slider.length;
    }

    function showSlider(i) {
        if (i > slider.length) {
            index = 1;
        }
        if (i < 1) {
            index = slider.length;
        }
        slider.forEach((el) => el.classList.add('hide'));
        slider[index - 1].classList.add('show'); 

        if (slider.length < 10) {
            current.textContent =  `0${index}`;
        } else {
            current.textContent =  index;
        }
    }
    function plusSlides (n) {
        showSlider(index += n);
    }

    nextSlider.addEventListener('click', function() {
        slider[index - 1].classList.remove('show');
        plusSlides(1);
    });
   
    prevSlider.addEventListener('click', function(){
        slider[index - 1].classList.remove('show');
        plusSlides(-1);
    });



    //КАЛЬКУЛЯТОР
     const result = document.querySelector('.calculating__result span');
     let sex, height, weight, age, ratio;

     if(localStorage.getItem('sex')) {
         sex = localStorage.getItem('sex');
     } else {
         sex = 'male';
         localStorage.setItem('sex', 'male');
     }

     if(localStorage.getItem('ratio')){
         ratio = localStorage.getItem('ratio');
     } else {
         ratio = 1.375;
         localStorage.setItem('ratio', 1.375); //дефолтное значение 1.375 в пункте ratio 
     }
     function calc(){
         if(!sex || !height || !weight || !age || !ratio){
             result.textContent = '_____';
             return;
         }
         if(sex === 'male'){
             result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
         } else {
             result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
         }
     }

     calc();
     function localSetting (selector, activeClass) {
         const elements = document.querySelectorAll(selector);

         elements.forEach((elem) => {
            elem.classList.remove(activeClass);
            if(elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if(elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
         });
     }

     localSetting('#gender div', 'calculating__choose-item_active');
     localSetting('.calculating__choose_big div', 'calculating__choose-item_active');

    //работа с выбираемыми данными
     function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
                //для всех элементов удалим значение 
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                //затем длбавим активный класс элементу на который кликнули
                e.target.classList.add(activeClass);
    
                calc();
            });
        });
    }
    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) { //используем регулярный выражения и ищем глобально НЕ ЧМСЛА
                input.style.border = "1px solid red";
            } else {
                input.style.border = 'none';
            }
            switch(input.getAttribute('id')) {
                case "height":
                    height = +input.value;
                    break;
                case "weight":
                    weight = +input.value;
                    break;
                case "age":
                    age = +input.value;
                    break;
            }

            calc();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

});
