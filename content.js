/**
 * BATUMI GUIDE DATA SOURCE (Источники данных)
 * Здесь хранится весь контент сайта: тексты, переводы, ссылки и информация о местах.
 * Мы используем этот файл, чтобы не писать текст прямо в HTML.
 */

export const REPOSITORY = {
    meta: {
        title: "Our Places in Batumi",
        description: "Our favorite places in Batumi - cafes, restaurants, attractions and trips"
    },
    translations: {
        en: {

            contact_us: "Contact us",
            open_map: "Open on map",
            contacts: "Contacts",

            switch_theme: "Switch theme",
            switch_lang: "Switch language"
        },
        ru: {

            contact_us: "Связаться",
            open_map: "Открыть на карте",
            contacts: "Контакты",

            switch_theme: "Сменить тему",
            switch_lang: "Сменить язык"
        }
    },
    blocks: [
        {
            key: "eat",
            type: "slider",
            title: { en: "Cafes and Restaurants", ru: "Где поесть" },
            subtitle: { en: "Our favorite places in Batumi to grab food", ru: "Кафе и рестораны Батуми, которые мы любим" },
            items: [
                {
                    title: { en: "Old Ambari", ru: "Old Ambari" },
                    type: { en: "Restaurant", ru: "Ресторан" },
                    tags: { en: "Traditional Georgian cuisine", ru: "Традиционная грузинская кухня" },
                    desc: {
                        en: "Our first Batumi restaurant - still our go-to spot, and we bring every friend here. Yes, there are queues in season… because it’s one of the best places in Batumi",
                        ru: "Наш первый ресторан в Батуми — и до сих пор любимый. Водим сюда всех друзей. В сезон бывают очереди, потому что это одно из лучших мест."
                    },
                    /* Фоновая картинка (темная и светлая) */
                    image: {
                        dark: "img/oldambari-night.png",
                        light: "img/oldambari-light.png"
                    },
                    url: "https://www.google.com/maps/place/Old+Ambari/@41.6368789,41.6186037,16z/data=!4m16!1m8!3m7!1s0x40678776a7a83ddd:0x6ffa3b86251b8f4a!2sOld+Ambari!8m2!3d41.6357982!4d41.6162127!10e9!16s%2Fg%2F11ptnc8g9v!3m6!1s0x40678776a7a83ddd:0x6ffa3b86251b8f4a!8m2!3d41.6357982!4d41.6162127!10e9!16s%2Fg%2F11ptnc8g9v?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
                    kind: "venue"
                },
                {
                    title: { en: "Tavaduri", ru: "Tavaduri" },
                    type: { en: "Restaurant", ru: "Ресторан" },
                    tags: { en: "Traditional Georgian cuisine", ru: "Традиционная грузинская кухня" },
                    desc: {
                        en: "When our mom wants great food, a little dancing, and a true taste of Georgia, she goes here",
                        ru: "Когда мама хочет вкусно поесть, немного потанцевать и почувствовать настоящий вкус Грузии — она идет сюда."
                    },
                    /* Фоновая картинка (только для темной темы) */
                    image: "img/tavaduri-night.png",
                    url: "https://www.google.com/maps/place/Tavaduri/@41.6400675,41.6249453,17z/data=!4m7!3m6!1s0x4067860ddc38f15d:0x958f8a73428fbab9!8m2!3d41.6400675!4d41.6275202!10e9!16s%2Fg%2F11bw7bnw07?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
                    kind: "venue"
                },
                {
                    title: { en: "Tokyo House", ru: "Tokyo House" },
                    type: { en: "Restaurant", ru: "Ресторан" },
                    tags: { en: "Sushi and rolls", ru: "Суши и роллы" },
                    desc: {
                        en: "We finally found the best sushi & rolls in Batumi here",
                        ru: "Лучшие суши и роллы в Батуми, которые мы нашли."
                    },
                    /* Только темная тема */
                    image: "img/tokyohouse-night.png",
                    url: "https://www.google.com/maps/place/Tokyo+House/@41.6435449,41.6189083,18.5z/data=!4m11!1m2!2m1!1zdG9reW8gaG91c2Ug0LHQsNGC0YPQvNC4!3m7!1s0x4067864011a77799:0xa94daef6cbd7417f!8m2!3d41.6436917!4d41.6185866!10e9!15sChh0b2t5byBob3VzZSDQsdCw0YLRg9C80LhaGiIYdG9reW8gaG91c2Ug0LHQsNGC0YPQvNC4kgETamFwYW5lc2VfcmVzdGF1cmFudOABAA!16s%2Fg%2F11gdt44pl3?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
                    kind: "venue"
                },
                {
                    title: { en: "Gorki's Shawarma", ru: "Шаурма у Горького" },
                    type: { en: "Shawarma", ru: "Шаурма" },
                    tags: { en: "Cafe", ru: "Кафе" },
                    desc: {
                        en: "In our opinion, one of the best shawarmas in Batumi. Definitely grab the fries!",
                        ru: "По нашему мнению, одна из лучших шаурм в Батуми. Обязательно возьмите картошку!"
                    },
                    url: "https://www.google.com/maps/place/Gorki's+Shawarma/@41.6435615,41.6212013,21z/data=!4m10!1m2!2m1!1zdG9reW8gaG91c2Ug0LHQsNGC0YPQvNC4!3m6!1s0x4067863ffad1e56d:0x582a40efc0b372a8!8m2!3d41.6434193!4d41.6210631!10e9!16s%2Fg%2F11c1wx5f48?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
                    kind: "venue"
                },
                {
                    title: { en: "Ukrainochka", ru: "Украиночка" },
                    type: { en: "Restaurant", ru: "Ресторан" },
                    tags: { en: "Ukrainian cuisine", ru: "Украинская кухня" },
                    desc: {
                        en: "Ukrainian comfort food in Batumi warm, hearty, and truly home-style.",
                        ru: "Украинская домашняя кухня в Батуми. Сытно, тепло и по-настоящему по-домашнему."
                    },
                    /* И для темной, и для светлой (объект) */
                    image: {
                        dark: "img/ukrainochka-night.png",
                        light: "img/ukrainochka-light.jpg"
                    },
                    url: "https://www.google.com/maps/place/%D0%A3%D0%BA%D1%80%D0%B0%D0%B8%D0%BD%D0%BE%D1%87%D0%BA%D0%B0/@41.6413878,41.6116827,17z/data=!4m7!3m6!1s0x40678674723dd95f:0x284087b9ecaaf3e2!8m2!3d41.6413838!4d41.6142576!10e9!16s%2Fg%2F119t7mp2c?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
                    kind: "venue"
                }
            ]
        },
        {
            key: "city",
            type: "slider",
            title: { en: "In the city", ru: "В городе" },
            subtitle: { en: "Walks, viewpoints, cozy streets in Batumi.", ru: "Прогулки, виды и уютные улочки." },
            items: [
                {
                    title: { en: "Europe Square", ru: "Площадь Европы" },
                    type: { en: "City Park", ru: "Площадь" },
                    tags: { en: "Landmark · Photos · City Walk", ru: "Достопримечательность · Фото · Прогулка" },
                    desc: {
                        en: "Europe Square is Batumi’s iconic city-center spot, with lights, a fountain, and great photo angles. Come at sunset for that modern city vibe.",
                        ru: "Знаковое место в центре. Огни, фонтан, отличные ракурсы. Приходите на закате за атмосферой современного города."
                    },
                    url: "https://www.google.com/maps/place/%D0%9F%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D1%8C+%D0%95%D0%B2%D1%80%D0%BE%D0%BF%D1%8B/@41.6510389,41.6334102,17z/data=!3m1!4b1!4m6!3m5!1s0x406786408dd845ff:0x5660047e2e27d076!8m2!3d41.6510391!4d41.6360588!16s%2Fg%2F11c5_b2g01?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
                    kind: "venue"
                },
                {
                    title: { en: "Batumi seafront", ru: "Набережная Батуми" },
                    type: { en: "City Walk", ru: "Прогулка" },
                    tags: { en: "Seafront · Walk · Sunset Views", ru: "Набережная · Закат · Виды" },
                    desc: {
                        en: "If you haven’t walked the Batumi Seafront, you haven’t really seen Batumi.",
                        ru: "Если вы не гуляли по набережной — вы не видели Батуми."
                    },
                    url: "https://www.google.com/maps/place/Batumi+seafront+(%D0%9D%D0%B0%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D0%BD%D0%B0%D1%8F+%D0%91%D0%B0%D1%82%D1%83%D0%BC%D0%B8)/@41.6495967,41.6141706,14.75z/data=!4m6!3m5!1s0x40678739dc5ef755:0x8a825979eb6ccfb4!8m2!3d41.6533684!4d41.6282412!16s%2Fg%2F11l1dj06js?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
                    kind: "venue"
                },
                {
                    title: { en: "Ferris wheel", ru: "Колесо обозрения" },
                    type: { en: "Panoramic ride", ru: "Аттракцион" },
                    tags: { en: "Panoramic ride · City lights", ru: "Панорама · Огни города" },
                    desc: {
                        en: "Ferris wheel on the seafront with views of the bay and skyline. Good at sunset.",
                        ru: "Колесо на набережной с видом на бухту и город. Красиво на закате."
                    },
                    url: "https://www.google.com/maps/place/Ferris+Wheel+Batumi/",
                    kind: "venue"
                },
                {
                    title: { en: "Old Batumi", ru: "Старый Батуми" },
                    type: { en: "Streets", ru: "Район" },
                    tags: { en: "Architecture · Small squares", ru: "Архитектура · Улочки" },
                    desc: {
                        en: "Area with narrow streets, old buildings and many small cafes and wine bars.",
                        ru: "Район с узкими улочками, старыми домами и множеством маленьких кафе и винных баров."
                    },
                    url: "https://www.google.com/maps/search/Old+Town+Batumi/",
                    kind: "venue"
                },
                {
                    title: { en: "Dancing fountains", ru: "Танцующие фонтаны" },
                    type: { en: "Evening show", ru: "Шоу" },
                    tags: { en: "Music · Lights", ru: "Музыка · Свет" },
                    desc: {
                        en: "Light and music show on the lake. Works well for a short evening walk.",
                        ru: "Свето-музыкальное шоу на озере. Хорошо подходит для короткой вечерней прогулки."
                    },
                    url: "https://www.google.com/maps/search/Dancing+Fountains+Batumi/",
                    kind: "venue"
                }
            ]
        },
        {
            key: "nature",
            type: "slider",
            title: { en: "Nature / Trips", ru: "Природа / Поездки" },
            subtitle: { en: "Day trips and nature spots around Batumi.", ru: "Выезды на природу вокруг Батуми." },
            items: [
                {
                    title: { en: "The best guide in Batumi-Georgiy", ru: "Лучший гид — Георгий" },
                    type: { en: "Guide", ru: "Гид" },
                    tags: { en: "Driver · Tours · Local guide", ru: "Водитель · Туры" },
                    desc: {
                        en: "Our go-to guy in Batumi. Georgiy can take you anywhere — mountains, hidden spots, and the best viewpoints. Need a ride or a day trip? He’s a lifesaver",
                        ru: "Наш человек в Батуми. Отвезет в горы, покажет скрытые места и лучшие виды. Если нужна поездка — он спасет."
                    },
                    url: "https://www.instagram.com/tours_in_georgia_withgeorge?igsh=MXNkOHgzc2syOTNvcg==",
                    kind: "service"
                },
                {
                    title: { en: "Botanical Garden", ru: "Ботанический сад" },
                    type: { en: "Hiking", ru: "Прогулка" },
                    tags: { en: "Forest - Waterfalls", ru: "Лес - Водопады" },
                    desc: {
                        en: "Rainy, lush national park with short and long hiking routes.",
                        ru: "Зеленый, пышный парк с короткими и длинными маршрутами для прогулок."
                    },
                    url: "https://www.google.com/maps/place/%D0%91%D0%BE%D1%82%D0%B0%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9+%D1%81%D0%B0%D0%B4+%D0%91%D0%B0%D1%82%D1%83%D0%BC%D0%B8/@41.6944442,41.7049203,17z/data=!3m1!4b1!4m6!3m5!1s0x405d7d685b666b09:0x3f7a5e91d16f9a8e!8m2!3d41.6944442!4d41.7074952!16s%2Fm%2F03c43p5?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoKLDEwMDc5MjA2N0gBUAM%3D",
                    kind: "venue"
                },
                {
                    title: { en: "Machakhela Valley", ru: "Долина Мачахела" },
                    type: { en: "Day trip", ru: "Поездка" },
                    tags: { en: "Mountains - River", ru: "Горы - Река" },
                    desc: {
                        en: "Mountain valley with river, bridges and small villages. Can be visited with a tour.",
                        ru: "Горная долина с рекой, мостами и деревнями. Можно поехать с туром."
                    },
                    url: "https://www.google.com/maps/place/Machakhela+National+Park/",
                    kind: "venue"
                },
                {
                    title: { en: "Green Lake", ru: "Зеленое озеро" },
                    type: { en: "High mountain lake", ru: "Горное озеро" },
                    tags: { en: "Lakes - Panoramas", ru: "Озера - Панорамы" },
                    desc: {
                        en: "Small lake high in the mountains. Usually visited with 4x4 tour in summer.",
                        ru: "Небольшое озеро высоко в горах. Обычно ездят на джипах летом."
                    },
                    url: "https://www.google.com/maps/search/Green+Lake+Adjara/",
                    kind: "venue"
                },
                {
                    title: { en: "Makhuntseti waterfall", ru: "Водопад Махунцети" },
                    type: { en: "Waterfall", ru: "Водопад" },
                    tags: { en: "Waterfall - Bridge - River", ru: "Водопад - Мост" },
                    desc: {
                        en: "Popular waterfall with stone bridge and river views. Easy half-day trip from Batumi.",
                        ru: "Популярный водопад с каменным мостом. Легкая поездка на полдня из Батуми."
                    },
                    url: "https://www.google.com/maps/place/Makhuntseti+Waterfall/",
                    kind: "venue"
                }
            ]
        },
        {
            key: "street",
            type: "slider",
            title: { en: "What to buy on the street", ru: "Что купить на улице" },
            subtitle: { en: "Street snacks and local things you can easily buy nearby.", ru: "Уличные снеки и местные продукты." },
            items: [
                {
                    title: { en: "Churchkhela", ru: "Чурчхела" },
                    type: { en: "Street sweet", ru: "Сладость" },
                    tags: { en: "Walnuts - Grape juice", ru: "Орехи - Сок" },
                    desc: {
                        en: "Nut-filled sweet in thick grape juice. Easy to take with you or bring home.",
                        ru: "Орехи в густом виноградном соке. Удобно взять с собой или привезти домой."
                    },
                    url: "https://www.google.com/maps/search/Churchkhela+Batumi/",
                    kind: "venue"
                },
                {
                    title: { en: "Sulguni cheese", ru: "Сыр Сулугуни" },
                    type: { en: "Cheese", ru: "Сыр" },
                    tags: { en: "Cheese - Salty", ru: "Сыр - Соленый" },
                    desc: {
                        en: "Local salty cheese you will find in markets and small shops with dairy products.",
                        ru: "Местный соленый сыр. Ищите на рынках и в молочных лавочках."
                    },
                    url: "https://www.google.com/maps/search/Sulguni+Batumi/",
                    kind: "venue"
                },
                {
                    title: { en: "Adjika & spices", ru: "Аджика и специи" },
                    type: { en: "Spices", ru: "Специи" },
                    tags: { en: "Adjika - Mixes - Gifts", ru: "Аджика - Смеси" },
                    desc: {
                        en: "Colorful spice mixes and adjika pastes. Good as small gifts from Georgia.",
                        ru: "Разноцветные специи и аджика. Отличный небольшой подарок из Грузии."
                    },
                    url: "https://www.google.com/maps/search/spices+market+Batumi/",
                    kind: "venue"
                },
                {
                    title: { en: "Local wine", ru: "Местное вино" },
                    type: { en: "Wine", ru: "Вино" },
                    tags: { en: "Bottled wine - Semi-sweet", ru: "Бутылочное - Полусладкое" },
                    desc: {
                        en: "Good selection of local wines.",
                        ru: "Хороший выбор местных вин."
                    },
                    url: "https://www.google.com/maps/search/wine+shop+Batumi/",
                    kind: "venue"
                },
                {
                    title: { en: "Seasonal fruits", ru: "Сезонные фрукты" },
                    type: { en: "Fruits", ru: "Фрукты" },
                    tags: { en: "Figs - Grapes - Mandarins", ru: "Инжир - Виноград" },
                    desc: {
                        en: "Depending on the season you can find great fruits on small stands and in markets.",
                        ru: "В зависимости от сезона, на лавках и рынках можно найти отличные фрукты."
                    },
                    url: "https://www.google.com/maps/search/fruit+market+Batumi/",
                    kind: "venue"
                }
            ]
        }
    ]
};
