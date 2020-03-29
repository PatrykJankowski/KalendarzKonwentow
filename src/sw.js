const PRECACHE = 'precache-v1';
const RUNTIME = 'runtime';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    'index.html'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(self.skipWaiting())
    );
});







let cityField = document.getElementById('jform_location');
let addressField = document.getElementById('jform_address');
let mapField = document.getElementById('jform_mapurl');
let longField = document.getElementById('jform_long');
let latField = document.getElementById('jform_lat');
let voivodeshipField = document.getElementById("jform_voivodeship");
let data;

cityField.addEventListener("blur", geocodeAndFill);
addressField.addEventListener("blur", geocodeAndFill);

function geocodeAndFill() {
    if (cityField.value.length > 1) {
        const xhr = new XMLHttpRequest();
        let address = addressField.value ? addressField.value.replace(/ \([\s\S]*?\)/g, '') + ", " : '';

        xhr.addEventListener("load", function () {
            if (xhr.status === 200) {
                let response = JSON.parse(xhr.response)[0];
                let voivodeship = response.display_name.toLowerCase().split("województwo ")[1];

                if (voivodeship) {
                    voivodeshipField.value = voivodeship.split(",")[0];
                }

                latField.value = response.lat;
                longField.value = response.lon;

                document.getElementById("voivodeship").getElementsByTagName("span")[0].innerHTML = voivodeshipField.value;
                mapField.value = "https://maps.google.com/maps?hl=pl&q="+address+cityField.value + "," + voivodeshipField.value + "&ie=UTF8&t=&z=14&iwloc=B&output=embed"
            }
        });
        xhr.open("GET", "https://eu1.locationiq.com/v1/search.php?key=8d421277d57326&q="+address+cityField.value+", Polska&format=json", true);
        xhr.send();
    }
}
