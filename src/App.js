import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://glcxzuadoelmouihsill.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsY3h6dWFkb2VsbW91aWhzaWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MjcyODcsImV4cCI6MjA4NzMwMzI4N30.VJ8T4Vodtd3f2W9JNQzFQXGYqq3m4TKT-FQYWL3rNcY"
);

const ADMIN_EMAIL = "javierglocret@icloud.com";

const CATS = [
  { id:"All",      label:"All",      icon:"",   color:"var(--green)", bg:"rgba(0,208,132,0.1)" },
  { id:"Training", label:"Training", icon:"🎾", color:"#3b82f6",     bg:"rgba(59,130,246,0.1)" },
  { id:"Ask",      label:"Ask",      icon:"💬", color:"#f59e0b",     bg:"rgba(245,158,11,0.1)" },
  { id:"On Tour",  label:"On Tour",  icon:"✈️", color:"#a78bfa",     bg:"rgba(167,139,250,0.1)" },
  { id:"Life",     label:"Life",     icon:"⚡", color:"#10b981",     bg:"rgba(16,185,129,0.1)" },
];
const getCat = (id) => CATS.find(c => c.id === id) || CATS[1];

const REACTIONS = [
  { id:"tennis",  emoji:"🎾", label:"Respect" },
  { id:"fire",    emoji:"🔥", label:"Fire"    },
  { id:"hundred", emoji:"💯", label:"Facts"   },
];

const SURFACE_COLOR = { Hard:"#3b82f6", Clay:"#f97316", Grass:"#10b981", "Indoor Hard":"#8b5cf6" };
const CAT_RANK = { "Grand Slam":1,"Masters 1000":2,"ATP 500":3,"WTA 500":3,"ATP 250":4,"WTA 250":4 };
const SURFACES = ["Hard","Clay","Grass","Indoor Hard"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const FLAG = {
  "Argentina":"🇦🇷","Australia":"🇦🇺","Austria":"🇦🇹","Belgium":"🇧🇪","Brazil":"🇧🇷",
  "Bulgaria":"🇧🇬","Canada":"🇨🇦","Chile":"🇨🇱","China":"🇨🇳","Croatia":"🇭🇷",
  "France":"🇫🇷","Germany":"🇩🇪","Greece":"🇬🇷","India":"🇮🇳","Italy":"🇮🇹",
  "Japan":"🇯🇵","Mexico":"🇲🇽","Monaco":"🇲🇨","Netherlands":"🇳🇱","New Zealand":"🇳🇿",
  "Norway":"🇳🇴","Poland":"🇵🇱","Portugal":"🇵🇹","Qatar":"🇶🇦","Romania":"🇷🇴",
  "Russia":"🇷🇺","Serbia":"🇷🇸","Spain":"🇪🇸","Sweden":"🇸🇪","Switzerland":"🇨🇭",
  "UAE":"🇦🇪","United Kingdom":"🇬🇧","USA":"🇺🇸","United States":"🇺🇸","Ukraine":"🇺🇦",
  "Colombia":"🇨🇴","Peru":"🇵🇪","Ecuador":"🇪🇨","Kazakhstan":"🇰🇿","Finland":"🇫🇮",
  "Denmark":"🇩🇰","Czech Republic":"🇨🇿","Slovakia":"🇸🇰","South Africa":"🇿🇦",
  "South Korea":"🇰🇷","Uruguay":"🇺🇾","Great Britain":"🇬🇧",
};
const getFlag = (c) => FLAG[c] || "🌍";

// ── Complete city guides for ALL tournament cities ──────────
const CITY_TIPS = {
  "Melbourne":[{cat:"Training",text:"Melbourne Park practice courts 6am–8pm. Book via Tennis Australia portal.",icon:"🎾"},{cat:"Recovery",text:"Stretch Lab South Yarra — best physio on circuit. Ask for Marcus.",icon:"💆"},{cat:"Food",text:"Tipo 00 CBD — carb loading done right. Incredible fresh pasta.",icon:"🍝"},{cat:"Hotel",text:"Crown Towers — 20% off during AO with player credential.",icon:"🏨"},{cat:"Shopping",text:"Collins Street — Hermès, Louis Vuitton, Gucci all within 2 blocks.",icon:"🛍️"}],
  "Paris":[{cat:"Training",text:"Racing Club de France, Bois de Boulogne — clay courts 5 min from RG.",icon:"🎾"},{cat:"Recovery",text:"Institut du Sport 13ème — best cryotherapy in Paris.",icon:"💆"},{cat:"Food",text:"Le Relais de l'Entrecôte — no menu, just steak. Players love it.",icon:"🥩"},{cat:"Hotel",text:"Molitor Hotel — rooftop pool, 10 min from Roland Garros by bike.",icon:"🏨"},{cat:"Shopping",text:"Avenue Montaigne — Dior, Chanel, Valentino. 15 min Uber from RG.",icon:"🛍️"}],
  "London":[{cat:"Training",text:"National Tennis Centre, Roehampton — book 2 weeks ahead in June.",icon:"🎾"},{cat:"Recovery",text:"Third Space Soho — best gym in central London, open 6am.",icon:"💆"},{cat:"Food",text:"Gymkhana — high protein Indian, no dairy options available.",icon:"🍛"},{cat:"Hotel",text:"Cannizaro House, Wimbledon Village — walking distance to grounds.",icon:"🏨"},{cat:"Shopping",text:"Harrods Knightsbridge — 20 min from Wimbledon by tube.",icon:"🛍️"}],
  "New York":[{cat:"Training",text:"USTA Billie Jean King Center — Courts 8-17 are always less crowded.",icon:"🎾"},{cat:"Recovery",text:"Equinox 61st — full recovery suite, cold plunge, sauna.",icon:"💆"},{cat:"Food",text:"Carbone — book 3 weeks ahead minimum. Worth every dollar.",icon:"🍷"},{cat:"Hotel",text:"1 Hotel Brooklyn Bridge — great views, 25 min Uber to Flushing.",icon:"🏨"},{cat:"Shopping",text:"5th Avenue — Saks, Bergdorf Goodman. Players spotted here every year.",icon:"🛍️"}],
  "Miami":[{cat:"Training",text:"Crandon Park — courts next to the venue. Go before 9am.",icon:"🎾"},{cat:"Recovery",text:"Next Health Brickell — ice barrels essential in Miami heat.",icon:"💆"},{cat:"Food",text:"Zuma Brickell — light Japanese, clean proteins. Players go here every year.",icon:"🍱"},{cat:"Hotel",text:"EAST Miami — rooftop pool, 15 min Uber to Key Biscayne.",icon:"🏨"},{cat:"Shopping",text:"Bal Harbour Shops — Chanel, Prada, Loro Piana. 30 min north.",icon:"🛍️"}],
  "Indian Wells":[{cat:"Training",text:"Indian Wells Tennis Garden — 26 courts, best practice facility on tour.",icon:"🎾"},{cat:"Recovery",text:"Eisenhower Health — full sports medicine team on site during tournament.",icon:"💆"},{cat:"Food",text:"Las Casuelas Terraza — best Mexican in the desert, players staple.",icon:"🌮"},{cat:"Hotel",text:"The Ritz-Carlton Rancho Mirage — stunning desert views, 15 min to venue.",icon:"🏨"},{cat:"Shopping",text:"El Paseo Drive — the Rodeo Drive of the desert.",icon:"🛍️"}],
  "Monte Carlo":[{cat:"Training",text:"Monte-Carlo Country Club courts — request through tournament office.",icon:"🎾"},{cat:"Recovery",text:"Thermes Marins Monte-Carlo — thalassotherapy, sea water pools.",icon:"💆"},{cat:"Food",text:"Le Louis XV by Alain Ducasse — best restaurant in Monaco. Reserve.",icon:"⭐"},{cat:"Hotel",text:"Hotel de Paris — legendary. Connected to Casino. Players stay here.",icon:"🏨"},{cat:"Shopping",text:"Casino Square — Hermes, Cartier, Dior. 2 min from casino.",icon:"🛍️"}],
  "Madrid":[{cat:"Training",text:"Caja Magica practice courts — 12 courts available. Book via tournament.",icon:"🎾"},{cat:"Recovery",text:"Clinica CEMTRO — best sports medicine in Madrid.",icon:"💆"},{cat:"Food",text:"DiverXO — Michelin 3-star by David Munoz. Book 2 months ahead.",icon:"⭐"},{cat:"Hotel",text:"Rosewood Villa Magna — central, 20 min to Caja Magica.",icon:"🏨"},{cat:"Shopping",text:"Calle Serrano — Loewe flagship, Balenciaga, Prada.",icon:"🛍️"}],
  "Rome":[{cat:"Training",text:"Foro Italico practice courts — clay, book through tournament office.",icon:"🎾"},{cat:"Recovery",text:"Villa Stuart Sports Clinic — used by AS Roma, excellent physio.",icon:"💆"},{cat:"Food",text:"Da Enzo al 29, Trastevere — authentic Roman, cacio e pepe is perfect.",icon:"🍝"},{cat:"Hotel",text:"Hotel Eden — rooftop restaurant, views of Villa Borghese.",icon:"🏨"},{cat:"Shopping",text:"Via Condotti — Gucci, Bulgari, Valentino. Near Spanish Steps.",icon:"🛍️"}],
  "Toronto":[{cat:"Training",text:"Sobeys Stadium courts — practice available early morning during tournament.",icon:"🎾"},{cat:"Recovery",text:"Cleveland Clinic Canada, Yorkville — world class sports medicine.",icon:"💆"},{cat:"Food",text:"Canoe Restaurant — rooftop views of Lake Ontario. Best in Toronto.",icon:"🍽️"},{cat:"Hotel",text:"Four Seasons Yorkville — 20 min to Sobeys Stadium by car.",icon:"🏨"},{cat:"Shopping",text:"Yorkville Avenue — Hermès, Chanel, Holt Renfrew flagship.",icon:"🛍️"}],
  "Montreal":[{cat:"Training",text:"IGA Stadium practice courts — request via tournament desk.",icon:"🎾"},{cat:"Recovery",text:"Clinique du Plateau — sports physio specialists, downtown location.",icon:"💆"},{cat:"Food",text:"Joe Beef — legendary Montreal steakhouse. Book 3 weeks ahead.",icon:"🥩"},{cat:"Hotel",text:"Four Seasons Montreal — Old Montreal, beautiful spa.",icon:"🏨"},{cat:"Shopping",text:"Rue Sainte-Catherine — all major brands, Underground City nearby.",icon:"🛍️"}],
  "Cincinnati":[{cat:"Training",text:"Lindner Family Tennis Center — full practice facility available.",icon:"🎾"},{cat:"Recovery",text:"UC Health Sports Medicine — official tournament medical partner.",icon:"💆"},{cat:"Food",text:"Prime Cincinnati — best steakhouse in the city, players favorite.",icon:"🥩"},{cat:"Hotel",text:"21c Museum Hotel — art hotel downtown, 20 min to venue.",icon:"🏨"},{cat:"Shopping",text:"Newport on the Levee — across the Ohio River, main shopping area.",icon:"🛍️"}],
  "Shanghai":[{cat:"Training",text:"Qi Zhong practice courts — request through tournament. 15 hard courts.",icon:"🎾"},{cat:"Recovery",text:"Shanghai United Family Hospital Sports Medicine — best in city.",icon:"💆"},{cat:"Food",text:"Ultraviolet by Paul Pairet — 20-course immersive. Book months ahead.",icon:"⭐"},{cat:"Hotel",text:"The Peninsula Shanghai — Bund views, butler service.",icon:"🏨"},{cat:"Shopping",text:"Plaza 66 Nanjing Road — Chanel, Hermes, Louis Vuitton.",icon:"🛍️"}],
  "Beijing":[{cat:"Training",text:"National Tennis Center — courts available outside match hours.",icon:"🎾"},{cat:"Recovery",text:"Beijing United Family Hospital — best international sports medicine.",icon:"💆"},{cat:"Food",text:"Da Dong Roast Duck — the definitive Beijing duck. Reserve ahead.",icon:"🦆"},{cat:"Hotel",text:"The Opposite House, Sanlitun — best boutique hotel in Beijing.",icon:"🏨"},{cat:"Shopping",text:"Shin Kong Place, Chaoyang — full luxury floor, all major brands.",icon:"🛍️"}],
  "Dubai":[{cat:"Training",text:"Dubai Tennis Stadium courts available from 7am during tournament week.",icon:"🎾"},{cat:"Recovery",text:"Talise Ottoman Spa — best recovery spa in Dubai.",icon:"💆"},{cat:"Food",text:"Zuma DIFC — same quality as Miami. Essential stop.",icon:"🍱"},{cat:"Hotel",text:"One&Only Royal Mirage — quiet, 15 min from venue. Players favorite.",icon:"🏨"},{cat:"Shopping",text:"Dubai Mall — Louis Vuitton, Rolex, all major brands.",icon:"🛍️"}],
  "Doha":[{cat:"Training",text:"Khalifa International Tennis Complex — 12 courts, practice slots available.",icon:"🎾"},{cat:"Recovery",text:"Aspetar Orthopaedic and Sports Medicine Hospital — world class, free for athletes.",icon:"💆"},{cat:"Food",text:"Nobu Doha — clean Japanese proteins. Excellent pre-match option.",icon:"🍣"},{cat:"Hotel",text:"Mandarin Oriental Doha — stunning bay views, excellent spa.",icon:"🏨"},{cat:"Shopping",text:"Villaggio Mall — Venice-themed, full luxury selection.",icon:"🛍️"}],
  "Rotterdam":[{cat:"Training",text:"Rotterdam Ahoy courts — available early morning. Speak to tournament desk.",icon:"🎾"},{cat:"Recovery",text:"Erasmus MC Sports Medicine — best in the Netherlands.",icon:"💆"},{cat:"Food",text:"Restaurant Fred — creative Dutch cuisine, excellent quality.",icon:"🍽️"},{cat:"Hotel",text:"nhow Rotterdam — design hotel in the Cube Houses area.",icon:"🏨"},{cat:"Shopping",text:"Beurstraverse — Bijenkorf, Hugo Boss, Tommy Hilfiger.",icon:"🛍️"}],
  "Acapulco":[{cat:"Training",text:"Arena GNP Seguros practice courts — book early, high demand.",icon:"🎾"},{cat:"Recovery",text:"Hotel Princess Mundo Imperial Spa — full sports recovery facilities.",icon:"💆"},{cat:"Food",text:"Zibu Restaurant — beachfront, incredible fish tacos and ceviche.",icon:"🌮"},{cat:"Hotel",text:"Banyan Tree Cabo Marques — clifftop views, infinity pool, stunning.",icon:"🏨"},{cat:"Shopping",text:"La Isla Shopping Village — by the marina, main retail area.",icon:"🛍️"}],
  "Barcelona":[{cat:"Training",text:"Real Club de Tenis Barcelona — clay courts, 10 courts available.",icon:"🎾"},{cat:"Recovery",text:"Quiron Salud — FC Barcelona's medical team, best in Spain.",icon:"💆"},{cat:"Food",text:"Disfrutar — best restaurant in Barcelona, 2 Michelin stars.",icon:"⭐"},{cat:"Hotel",text:"Hotel Arts Barcelona — beachfront, Ritz-Carlton, iconic.",icon:"🏨"},{cat:"Shopping",text:"Passeig de Gracia — Loewe, Chanel, Hermes in one avenue.",icon:"🛍️"}],
  "Hamburg":[{cat:"Training",text:"Am Rothenbaum — clay courts, practice slots before 10am.",icon:"🎾"},{cat:"Recovery",text:"Eimsbuetteler Turnverband Sports Medicine — top Hamburg physio.",icon:"💆"},{cat:"Food",text:"The Table — one Michelin star, Kevin Fehling. Book well ahead.",icon:"⭐"},{cat:"Hotel",text:"The Fontenay — Hamburg's most exclusive hotel, lake views.",icon:"🏨"},{cat:"Shopping",text:"Neuer Wall — Hamburg's luxury street, Prada, Boss, Rolex.",icon:"🛍️"}],
  "Washington":[{cat:"Training",text:"Rock Creek Park Tennis Center — main tournament facility, 10 courts.",icon:"🎾"},{cat:"Recovery",text:"Medstar Sports Medicine Georgetown — best DC sports physio.",icon:"💆"},{cat:"Food",text:"Minibar by Jose Andres — avant-garde tasting menu. Book months ahead.",icon:"⭐"},{cat:"Hotel",text:"Four Seasons Georgetown — best hotel in DC, excellent service.",icon:"🏨"},{cat:"Shopping",text:"Georgetown M Street — Intermix, All Saints, boutique shopping.",icon:"🛍️"}],
  "Vienna":[{cat:"Training",text:"Wiener Stadthalle courts — indoor hard, available during tournament week.",icon:"🎾"},{cat:"Recovery",text:"Therme Wien — thermal spa, one of the best in Europe.",icon:"💆"},{cat:"Food",text:"Steirereck im Stadtpark — two Michelin stars, best in Vienna.",icon:"⭐"},{cat:"Hotel",text:"Hotel Sacher — historic, central, famous Sachertorte.",icon:"🏨"},{cat:"Shopping",text:"Kohlmarkt — Cartier, Chanel, Louis Vuitton.",icon:"🛍️"}],
  "Basel":[{cat:"Training",text:"St. Jakobshalle courts — practice before 10am during tournament.",icon:"🎾"},{cat:"Recovery",text:"Thermalbad and Spa Zurich — 45 min away, worth it for rest days.",icon:"💆"},{cat:"Food",text:"Restaurant Stucki — one Michelin star, Swiss-French cuisine.",icon:"⭐"},{cat:"Hotel",text:"Les Trois Rois — Rhein views, old town, legendary hotel.",icon:"🏨"},{cat:"Shopping",text:"Freie Strasse — Bucherer watches, Bally, local Swiss designers.",icon:"🛍️"}],
  "Tokyo":[{cat:"Training",text:"Ariake Colosseum courts — tournament practice facility, book early.",icon:"🎾"},{cat:"Recovery",text:"Roppongi Hills Club Spa — excellent hydrotherapy and massage.",icon:"💆"},{cat:"Food",text:"Sukiyabashi Jiro — if you can get a reservation, just go.",icon:"🍣"},{cat:"Hotel",text:"Aman Tokyo — best hotel in Japan. Serene, perfect for recovery.",icon:"🏨"},{cat:"Shopping",text:"Ginza — Uniqlo flagship, Dover Street Market, all luxury brands.",icon:"🛍️"}],
  "Stuttgart":[{cat:"Training",text:"Tennisclub Weissenhof — grass courts, book through tournament office.",icon:"🎾"},{cat:"Recovery",text:"Robert Bosch Hospital Sports Medicine — excellent facilities.",icon:"💆"},{cat:"Food",text:"Wielandshohe — one Michelin star, best in Stuttgart.",icon:"⭐"},{cat:"Hotel",text:"Steigenberger Graf Zeppelin — central, elegant, great service.",icon:"🏨"},{cat:"Shopping",text:"Koenigstrasse — main shopping street, Breuninger department store.",icon:"🛍️"}],
  "Halle":[{cat:"Training",text:"OWL Arena courts — grass practice available. Book via tournament.",icon:"🎾"},{cat:"Recovery",text:"Sportpark Lohrheidestadion Physio — recommended by players.",icon:"💆"},{cat:"Food",text:"Weinhaus Dichtl — best local restaurant, traditional German.",icon:"🍽️"},{cat:"Hotel",text:"Dorint Hotel Paderborn — closest high-end option to venue.",icon:"🏨"},{cat:"Shopping",text:"Altstadt Halle — pedestrian zone with main retail options.",icon:"🛍️"}],
  "Queens":[{cat:"Training",text:"Queens Club courts — grass practice, limited slots for seeded players.",icon:"🎾"},{cat:"Recovery",text:"Pure Sports Medicine Kensington — highly rated by players.",icon:"💆"},{cat:"Food",text:"River Cafe Hammersmith — iconic London restaurant, riverside.",icon:"🍽️"},{cat:"Hotel",text:"The Milestone Hotel Kensington — boutique, 5 min from Queens Club.",icon:"🏨"},{cat:"Shopping",text:"King's Road Chelsea — boutique shopping, all fashion brands.",icon:"🛍️"}],
  "Adelaide":[{cat:"Training",text:"Memorial Drive Tennis Centre — 14 courts, excellent practice facility.",icon:"🎾"},{cat:"Recovery",text:"SA Sports Institute — world class recovery and physio.",icon:"💆"},{cat:"Food",text:"Orana Restaurant — indigenous Australian cuisine, unforgettable.",icon:"🍽️"},{cat:"Hotel",text:"InterContinental Adelaide — riverside, walking distance to city.",icon:"🏨"},{cat:"Shopping",text:"Rundle Mall — Adelaide's main shopping precinct.",icon:"🛍️"}],
  "Auckland":[{cat:"Training",text:"ASB Tennis Centre — 10 courts, book through tournament office.",icon:"🎾"},{cat:"Recovery",text:"Auckland Sports Medicine Centre — best in New Zealand.",icon:"💆"},{cat:"Food",text:"Clooney Restaurant — fine dining, best in Auckland.",icon:"🍽️"},{cat:"Hotel",text:"The Grand by SkyCity — central, connected to Sky Tower.",icon:"🏨"},{cat:"Shopping",text:"Britomart Precinct — boutique designers, great for rest day.",icon:"🛍️"}],
  "Pune":[{cat:"Training",text:"Balewadi Sports Complex — 8 hard courts, book via tournament.",icon:"🎾"},{cat:"Recovery",text:"Ruby Hall Clinic Sports Medicine — best in Pune.",icon:"💆"},{cat:"Food",text:"Malaka Spice — best fusion restaurant in Pune.",icon:"🍽️"},{cat:"Hotel",text:"JW Marriott Pune — best hotel in the city, excellent spa.",icon:"🏨"},{cat:"Shopping",text:"Phoenix Marketcity Pune — all major international brands.",icon:"🛍️"}],
  "Dallas":[{cat:"Training",text:"Styslinger Altec Tennis Complex — indoor hard, 12 courts.",icon:"🎾"},{cat:"Recovery",text:"Baylor Scott and White Sports Therapy — best in Dallas.",icon:"💆"},{cat:"Food",text:"Knife Steakhouse — best dry-aged beef in Texas.",icon:"🥩"},{cat:"Hotel",text:"The Ritz-Carlton Dallas — Uptown, excellent recovery amenities.",icon:"🏨"},{cat:"Shopping",text:"NorthPark Center — best mall in Dallas, full luxury level.",icon:"🛍️"}],
  "Marseille":[{cat:"Training",text:"Palais des Sports courts — indoor hard, available via tournament.",icon:"🎾"},{cat:"Recovery",text:"Institut du Sport et de la Medecine du Sport — recommended.",icon:"💆"},{cat:"Food",text:"Le Petit Nice — 3 Michelin stars, best bouillabaisse in the world.",icon:"⭐"},{cat:"Hotel",text:"InterContinental Marseille — Old Port views, rooftop pool.",icon:"🏨"},{cat:"Shopping",text:"Centre Bourse — main shopping centre near Old Port.",icon:"🛍️"}],
  "Delray Beach":[{cat:"Training",text:"Delray Beach Tennis Center — main facility, practice slots available.",icon:"🎾"},{cat:"Recovery",text:"Delray Medical Center Sports Medicine — on-call during tournament.",icon:"💆"},{cat:"Food",text:"Tramonti Ristorante — best Italian in Delray, players staple.",icon:"🍝"},{cat:"Hotel",text:"The Seagate Hotel — beachfront, 5 min from venue.",icon:"🏨"},{cat:"Shopping",text:"Atlantic Avenue — boutique shopping, beach town vibe.",icon:"🛍️"}],
  "Buenos Aires":[{cat:"Training",text:"Buenos Aires Lawn Tennis Club — clay courts, excellent facility.",icon:"🎾"},{cat:"Recovery",text:"FLENI Sports Medicine Institute — world-class, players trust it.",icon:"💆"},{cat:"Food",text:"Don Julio Parrilla — best asado in Buenos Aires. Book ahead.",icon:"🥩"},{cat:"Hotel",text:"Alvear Palace Hotel — most exclusive hotel in BA, legendary.",icon:"🏨"},{cat:"Shopping",text:"Palermo Soho — independent boutiques, unique Argentine designers.",icon:"🛍️"}],
  "Rio de Janeiro":[{cat:"Training",text:"Jockey Club Brasileiro — clay courts, request via tournament.",icon:"🎾"},{cat:"Recovery",text:"Copa D'Or Hospital Sports Medicine — best in Rio.",icon:"💆"},{cat:"Food",text:"Roberta Sudbrack — best fine dining in Rio, contemporary Brazilian.",icon:"🍽️"},{cat:"Hotel",text:"Belmond Copacabana Palace — iconic, beachfront, legendary hotel.",icon:"🏨"},{cat:"Shopping",text:"Shopping Leblon — best mall in Rio, international brands.",icon:"🛍️"}],
  "Santiago":[{cat:"Training",text:"Club de Campo — clay courts in the Andes foothills.",icon:"🎾"},{cat:"Recovery",text:"Clinica Las Condes Sports Medicine — best in Chile.",icon:"💆"},{cat:"Food",text:"Boragó — best restaurant in Chile, indigenous ingredients.",icon:"🍽️"},{cat:"Hotel",text:"The Ritz-Carlton Santiago — Las Condes, mountain views.",icon:"🏨"},{cat:"Shopping",text:"Parque Arauco — full luxury selection including Armani, Hugo Boss.",icon:"🛍️"}],
  "Montpellier":[{cat:"Training",text:"Sud de France Arena courts — indoor hard, available before matches.",icon:"🎾"},{cat:"Recovery",text:"CHU de Montpellier Sports Medicine — university hospital, excellent.",icon:"💆"},{cat:"Food",text:"La Maison de Petit Pierre — best Michelin restaurant in Montpellier.",icon:"⭐"},{cat:"Hotel",text:"Hotel Richer de Belleval — boutique palace in Place de la Comedie.",icon:"🏨"},{cat:"Shopping",text:"Polygone Shopping Centre — main retail, near city centre.",icon:"🛍️"}],
  "Estoril":[{cat:"Training",text:"Clube de Tenis do Estoril — clay courts, 15 min from Lisbon.",icon:"🎾"},{cat:"Recovery",text:"Hospital da Luz Sports Medicine — best in Lisbon area.",icon:"💆"},{cat:"Food",text:"Restaurante Fortaleza do Guincho — Michelin star, Atlantic views.",icon:"⭐"},{cat:"Hotel",text:"Palacio Estoril — legendary hotel, casino next door.",icon:"🏨"},{cat:"Shopping",text:"Lisbon downtown — Avenida da Liberdade, all luxury brands.",icon:"🛍️"}],
  "Munich":[{cat:"Training",text:"MTTC Iphitos — clay courts in English Garden, stunning setting.",icon:"🎾"},{cat:"Recovery",text:"FC Bayern Campus Sports Medicine — elite recovery facilities.",icon:"💆"},{cat:"Food",text:"Tantris — 2 Michelin stars, Munich institution since 1971.",icon:"⭐"},{cat:"Hotel",text:"Mandarin Oriental Munich — Altstadt, best hotel in Munich.",icon:"🏨"},{cat:"Shopping",text:"Maximilianstrasse — Bulgari, Gucci, Rolex, full luxury mile.",icon:"🛍️"}],
  "Lyon":[{cat:"Training",text:"Parc de la Tete d'Or — clay courts, beautiful park setting.",icon:"🎾"},{cat:"Recovery",text:"Centre Medico-Sportif Lyon — excellent sports physio.",icon:"💆"},{cat:"Food",text:"Paul Bocuse — legendary. The capital of French cuisine.",icon:"⭐"},{cat:"Hotel",text:"Cour des Loges — Renaissance hotel in Old Lyon, stunning.",icon:"🏨"},{cat:"Shopping",text:"Rue de la Republique — main shopping street, all major brands.",icon:"🛍️"}],
  "Geneva":[{cat:"Training",text:"Stade du Leman courts — clay, lake views, excellent facility.",icon:"🎾"},{cat:"Recovery",text:"Clinique La Prairie — world's most exclusive wellness clinic.",icon:"💆"},{cat:"Food",text:"Le Chat-Botte — 2 Michelin stars at Hotel Beau-Rivage.",icon:"⭐"},{cat:"Hotel",text:"Hotel Beau-Rivage — lake view, legendary, best in Geneva.",icon:"🏨"},{cat:"Shopping",text:"Rue du Rhone — Rolex, Patek Philippe, Cartier. Watch capital.",icon:"⌚"}],
  "Den Bosch":[{cat:"Training",text:"Autotron courts — grass, request practice via tournament office.",icon:"🎾"},{cat:"Recovery",text:"Sports Medical Centre Eindhoven — 30 min, best in the region.",icon:"💆"},{cat:"Food",text:"Moor — best restaurant in Den Bosch, modern Dutch cuisine.",icon:"🍽️"},{cat:"Hotel",text:"Hotel Central Den Bosch — historic centre, 10 min from venue.",icon:"🏨"},{cat:"Shopping",text:"Hinthamerstraat — pedestrian shopping, boutiques and cafes.",icon:"🛍️"}],
  "Eastbourne":[{cat:"Training",text:"Devonshire Park courts — grass, available for seeded players.",icon:"🎾"},{cat:"Recovery",text:"Sussex Sports Medicine — Eastbourne's top sports physio.",icon:"💆"},{cat:"Food",text:"The Mirabelle at Grand Hotel — best restaurant on the seafront.",icon:"🍽️"},{cat:"Hotel",text:"The Grand Hotel Eastbourne — Victorian seafront, classic.",icon:"🏨"},{cat:"Shopping",text:"The Beacon Shopping Centre — main retail in Eastbourne.",icon:"🛍️"}],
  "Mallorca":[{cat:"Training",text:"Santa Ponsa Tennis Club — grass courts, 12 available.",icon:"🎾"},{cat:"Recovery",text:"Clinica Juaneda Palma — best sports medicine in Mallorca.",icon:"💆"},{cat:"Food",text:"Zaranda — 2 Michelin stars in Es Capdella, worth the drive.",icon:"⭐"},{cat:"Hotel",text:"Cap Rocat — fortress hotel, most exclusive in Mallorca.",icon:"🏨"},{cat:"Shopping",text:"Paseo del Borne Palma — Louis Vuitton, Cartier, Zegna.",icon:"🛍️"}],
  "Newport":[{cat:"Training",text:"International Tennis Hall of Fame — grass courts, historic venue.",icon:"🎾"},{cat:"Recovery",text:"Newport Hospital Sports Medicine — on-call during tournament.",icon:"💆"},{cat:"Food",text:"The Black Pearl — best seafood in Newport, waterfront views.",icon:"🦞"},{cat:"Hotel",text:"Vanderbilt Newport — Gilded Age mansion, stunning property.",icon:"🏨"},{cat:"Shopping",text:"Bellevue Avenue — Newport's historic shopping street.",icon:"🛍️"}],
  "Bastad":[{cat:"Training",text:"Bastad Tennis Stadium — clay courts, scenic Swedish Riviera.",icon:"🎾"},{cat:"Recovery",text:"Norrvikens Health Resort — spa and recovery, 10 min from venue.",icon:"💆"},{cat:"Food",text:"Hotel Skansen Restaurant — best in Bastad, fresh local seafood.",icon:"🦞"},{cat:"Hotel",text:"Hotel Skansen — best hotel in Bastad, by the sea.",icon:"🏨"},{cat:"Shopping",text:"Bastad Town Centre — boutiques and galleries in the old town.",icon:"🛍️"}],
  "Umag":[{cat:"Training",text:"Stella Maris Sports Centre — 8 clay courts, Adriatic views.",icon:"🎾"},{cat:"Recovery",text:"Umag Health Centre — physiotherapy, on-call during tournament.",icon:"💆"},{cat:"Food",text:"Konoba Badi — best konoba in Istria, truffles and fresh fish.",icon:"🐟"},{cat:"Hotel",text:"Sol Garden Istra — best resort in Umag, sea views.",icon:"🏨"},{cat:"Shopping",text:"Umag Old Town — local boutiques and Croatian artisan shops.",icon:"🛍️"}],
  "Kitzbuhel":[{cat:"Training",text:"Tennis Club Kitzbuhel — clay in the Alps, altitude training bonus.",icon:"🎾"},{cat:"Recovery",text:"Klinik Orthopaedie Tirol — excellent Austrian sports medicine.",icon:"💆"},{cat:"Food",text:"Lois Stern Restaurant — best in Kitzbuhel, Austrian classics.",icon:"🍽️"},{cat:"Hotel",text:"Grand Tirolia Hotel — alpine luxury, stunning mountain views.",icon:"🏨"},{cat:"Shopping",text:"Hinterstadt — Kitzbuhel's luxury street, Prada and ski brands.",icon:"🛍️"}],
  "Gstaad":[{cat:"Training",text:"Roy Emerson Arena — clay courts at 1050m altitude.",icon:"🎾"},{cat:"Recovery",text:"Clinique Valmont Gstaad — exclusive wellness, stunning location.",icon:"💆"},{cat:"Food",text:"Chesery Restaurant — best in Gstaad, classic Alpine cuisine.",icon:"🍽️"},{cat:"Hotel",text:"The Alpina Gstaad — six stars, most exclusive alpine hotel.",icon:"🏨"},{cat:"Shopping",text:"Promenade Gstaad — Hermes, Louis Vuitton, Chopard.",icon:"⌚"}],
  "Los Cabos":[{cat:"Training",text:"Cabo Sports Complex — 8 hard courts, practice slots available.",icon:"🎾"},{cat:"Recovery",text:"Hospiten Los Cabos — international standard sports medicine.",icon:"💆"},{cat:"Food",text:"Manta at The Cape — best restaurant in Cabo, ocean views.",icon:"🐟"},{cat:"Hotel",text:"The Cape Thompson Hotel — stunning Lands End views.",icon:"🏨"},{cat:"Shopping",text:"Puerto Paraiso Mall — main shopping in Cabo San Lucas.",icon:"🛍️"}],
  "Atlanta":[{cat:"Training",text:"Atlantic Station Tennis Complex — hard courts, practice available.",icon:"🎾"},{cat:"Recovery",text:"Emory Sports Medicine — best in Atlanta, multiple players use it.",icon:"💆"},{cat:"Food",text:"Bacchanalia — best restaurant in Atlanta, farm to table.",icon:"🍽️"},{cat:"Hotel",text:"Four Seasons Atlanta — Midtown, best hotel in the city.",icon:"🏨"},{cat:"Shopping",text:"Buckhead Village — Hermes, Gucci, Saint Laurent.",icon:"🛍️"}],
  "Winston-Salem":[{cat:"Training",text:"Wake Forest Tennis Complex — one of the best college facilities in the US.",icon:"🎾"},{cat:"Recovery",text:"Wake Forest Baptist Health Sports Medicine — world class.",icon:"💆"},{cat:"Food",text:"Mozelle's Fresh Southern Bistro — best local restaurant.",icon:"🍽️"},{cat:"Hotel",text:"Kimpton Cardinal Hotel — historic building, best in city.",icon:"🏨"},{cat:"Shopping",text:"Thruway Shopping Center — main retail in Winston-Salem.",icon:"🛍️"}],
  "Chengdu":[{cat:"Training",text:"Sichuan International Tennis Center — hard courts, good practice.",icon:"🎾"},{cat:"Recovery",text:"West China Hospital Sports Medicine — best in Chengdu.",icon:"💆"},{cat:"Food",text:"Yu's Family Kitchen — elevated Sichuan cuisine, unforgettable.",icon:"🌶️"},{cat:"Hotel",text:"Waldorf Astoria Chengdu — best hotel, Jinjiang River views.",icon:"🏨"},{cat:"Shopping",text:"IFS Mall Chengdu — Prada, Gucci, all luxury brands.",icon:"🛍️"}],
  "Zhuhai":[{cat:"Training",text:"Hengqin International Tennis Center — 10 hard courts, excellent.",icon:"🎾"},{cat:"Recovery",text:"Zhuhai People's Hospital Sports Medicine — recommended.",icon:"💆"},{cat:"Food",text:"Chimelong International Ocean Resort restaurants — best options.",icon:"🍽️"},{cat:"Hotel",text:"Intercontinental Zhuhai — harbour views, best in city.",icon:"🏨"},{cat:"Shopping",text:"Zhuhai Duty Free Zone — luxury goods tax-free.",icon:"🛍️"}],
  "Metz":[{cat:"Training",text:"Les Arenes de Metz courts — indoor hard, book via tournament.",icon:"🎾"},{cat:"Recovery",text:"CHR Metz-Thionville Sports Medicine — regional hospital.",icon:"💆"},{cat:"Food",text:"La Table de Pol — best restaurant in Metz, French cuisine.",icon:"🍽️"},{cat:"Hotel",text:"La Citadelle Metz MGallery — inside a fortress, stunning.",icon:"🏨"},{cat:"Shopping",text:"Centre Saint-Jacques — main shopping centre in Metz.",icon:"🛍️"}],
  "Sofia":[{cat:"Training",text:"Arena Armeec courts — indoor hard, available outside match hours.",icon:"🎾"},{cat:"Recovery",text:"Tokuda Hospital Sofia Sports Medicine — best in Bulgaria.",icon:"💆"},{cat:"Food",text:"Made in Home — best restaurant in Sofia, Bulgarian cuisine.",icon:"🍽️"},{cat:"Hotel",text:"Grand Hotel Sofia — central, best business hotel in the city.",icon:"🏨"},{cat:"Shopping",text:"Paradise Center — largest mall in Sofia, all major brands.",icon:"🛍️"}],
  "Stockholm":[{cat:"Training",text:"Royal Tennis Hall — indoor hard courts, historic venue.",icon:"🎾"},{cat:"Recovery",text:"Capio Sports Medicine Stockholm — excellent, central location.",icon:"💆"},{cat:"Food",text:"Frantzen — 3 Michelin stars, best in Scandinavia. Book months ahead.",icon:"⭐"},{cat:"Hotel",text:"Grand Hotel Stockholm — waterfront, Nobel Prize hotel.",icon:"🏨"},{cat:"Shopping",text:"Biblioteksgatan — Acne Studios, Our Legacy, COS flagship.",icon:"🛍️"}],
  "Antwerp":[{cat:"Training",text:"Lotto Arena courts — indoor hard, request via tournament office.",icon:"🎾"},{cat:"Recovery",text:"UZA Sports Medicine University Hospital — excellent.",icon:"💆"},{cat:"Food",text:"The Jane — Michelin 2-star in a deconsecrated chapel. Iconic.",icon:"⭐"},{cat:"Hotel",text:"Botanic Sanctuary Antwerp — luxury in a 19th century clinic.",icon:"🏨"},{cat:"Shopping",text:"Nationalestraat — Dries Van Noten, Antwerp Six fashion district.",icon:"🛍️"}],
  "Naples":[{cat:"Training",text:"Palazzo dello Sport courts — hard courts, practice available.",icon:"🎾"},{cat:"Recovery",text:"Clinica Mediterranea Sports Medicine — best in Naples.",icon:"💆"},{cat:"Food",text:"Da Michele — the original Neapolitan pizza. Queue early.",icon:"🍕"},{cat:"Hotel",text:"Grand Hotel Vesuvio — waterfront, views of Vesuvius, legendary.",icon:"🏨"},{cat:"Shopping",text:"Via Chiaia — Prada, Ferragamo, local Neapolitan tailors.",icon:"🛍️"}],
  "Cordoba":[{cat:"Training",text:"Estadio Mario Alberto Kempes courts — clay, practice available.",icon:"🎾"},{cat:"Recovery",text:"Clinica Privada Velez Sarsfield — sports medicine, well equipped.",icon:"💆"},{cat:"Food",text:"La Nieta — best restaurant in Cordoba, traditional Argentine.",icon:"🥩"},{cat:"Hotel",text:"Hotel Quinto Sol — best boutique hotel in Cordoba.",icon:"🏨"},{cat:"Shopping",text:"Patio Olmos Shopping — main mall in Cordoba city centre.",icon:"🛍️"}],
};

// ── CSS ─────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
  html{-webkit-tap-highlight-color:transparent;}
  :root{
    --bg:#0a0a0b;--bg1:#111113;--bg2:#18181b;--bg3:#232328;
    --border:rgba(255,255,255,0.07);--border2:rgba(255,255,255,0.04);
    --text:#f0ede8;--text2:#8b8b8f;--text3:#4a4a50;
    --green:#00d084;--glow:rgba(0,208,132,0.15);
    --font:'DM Sans',-apple-system,sans-serif;
    --serif:'Playfair Display',Georgia,serif;
  }
  body{background:var(--bg);font-family:var(--font);color:var(--text);overscroll-behavior:none;}
  ::-webkit-scrollbar{display:none;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.45)}100%{transform:scale(1)}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  .fu{animation:fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both;}
  .fi{animation:fadeIn 0.2s ease both;}
  .su{animation:slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both;}
  .post{animation:fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both;}
  .pop{animation:pop 0.3s ease;}
  button{cursor:pointer;font-family:inherit;border:none;transition:opacity 0.15s,transform 0.1s;}
  button:active{transform:scale(0.96);}
  textarea,input,select{font-family:inherit;}
  input[type=file]{display:none;}
  input::placeholder,textarea::placeholder{color:var(--text3);}
  input:focus,textarea:focus{outline:none;}
  select{appearance:none;cursor:pointer;}
`;

// ── UI Components ───────────────────────────────────────────
const Avatar = ({ src, name, size=38, glow=false, flag="" }) => (
  <div style={{position:"relative",flexShrink:0,width:size,height:size}}>
    {src
      ? <img src={src} alt={name} style={{width:size,height:size,borderRadius:"50%",objectFit:"cover",boxShadow:glow?"0 0 20px rgba(0,208,132,0.4)":"none",border:glow?"2px solid var(--green)":"none"}}/>
      : <div style={{width:size,height:size,borderRadius:"50%",background:"linear-gradient(135deg,var(--green) 0%,#00b3d4 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.38,fontWeight:700,color:"#000",boxShadow:glow?"0 0 20px rgba(0,208,132,0.4)":"none",border:glow?"2px solid var(--green)":"none",fontFamily:"var(--font)"}}>{(name||"?")[0].toUpperCase()}</div>
    }
    {flag&&<span style={{position:"absolute",bottom:-2,right:-2,fontSize:size*0.36,lineHeight:1}}>{flag}</span>}
  </div>
);

const GreenBtn = ({ children, onClick, disabled, style={} }) => (
  <button onClick={onClick} disabled={disabled} style={{background:disabled?"var(--bg3)":"var(--green)",color:disabled?"var(--text3)":"#000",borderRadius:10,padding:"13px 20px",fontSize:14,fontWeight:600,width:"100%",boxShadow:disabled?"none":"0 0 24px var(--glow)",transition:"all 0.2s",letterSpacing:"-0.01em",...style}}>{children}</button>
);

const Inp = ({ label, style={}, ...props }) => (
  <div style={{marginBottom:16}}>
    {label&&<div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>{label}</div>}
    <input style={{width:"100%",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 14px",color:"var(--text)",fontSize:14,transition:"border-color 0.2s",...style}} {...props}/>
  </div>
);

const ErrBox = ({msg}) => msg?<div style={{fontSize:12,color:"#ef4444",marginBottom:16,padding:"10px 12px",background:"rgba(239,68,68,0.08)",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)"}}>{msg}</div>:null;
const OkBox  = ({msg}) => msg?<div style={{fontSize:12,color:"var(--green)",marginBottom:16,padding:"10px 14px",background:"rgba(0,208,132,0.08)",borderRadius:10,border:"1px solid rgba(0,208,132,0.2)"}}>{msg}</div>:null;

const Divider = () => <div style={{height:1,background:"var(--border2)",margin:"4px 0"}}/>;

// ── Main App ─────────────────────────────────────────────────
export default function App() {
  const [screen,  setScreen]  = useState("loading");
  const [tab,     setTab]     = useState("feed");
  const [session, setSession] = useState(null);
  const [player,  setPlayer]  = useState(null);
  const [posts,   setPosts]   = useState([]);
  const [pending, setPending] = useState([]);
  const [catFilter, setCatFilter] = useState("All");
  const [err, setErr] = useState("");
  const [ok,  setOk]  = useState("");
  const [loading, setLoading] = useState(false);

  // Reactions & polls
  const [reactions,     setReactions]     = useState({});
  const [likersModal,   setLikersModal]   = useState(null);
  const [likers,        setLikers]        = useState([]);
  const [pollData,      setPollData]      = useState({});
  const [reactionPicker,setReactionPicker]= useState(null);
  const [popAnim,       setPopAnim]       = useState({});

  // Auth forms
  const [lf, setLf] = useState({email:"",password:""});
  const [rf, setRf] = useState({name:"",country:"",ranking:"",tour:"ATP",email:"",password:""});
  const [credFile,    setCredFile]    = useState(null);
  const [credPreview, setCredPreview] = useState(null);

  // Compose
  const [postText,       setPostText]       = useState("");
  const [postCat,        setPostCat]        = useState("Training");
  const [mediaFile,      setMediaFile]      = useState(null);
  const [mediaPreview,   setMediaPreview]   = useState(null);
  const [mediaType,      setMediaType]      = useState(null);
  const [composeFocused, setComposeFocused] = useState(false);
  const [pollMode,       setPollMode]       = useState(false);
  const [pollOpts,       setPollOpts]       = useState(["",""]);
  const mediaRef = useRef();

  // Post interactions
  const [editPost,    setEditPost]    = useState(null);
  const [editText,    setEditText]    = useState("");
  const [expandedCms, setExpandedCms] = useState({});
  const [comments,    setComments]    = useState({});
  const [cmText,      setCmText]      = useState({});
  const [editCm,      setEditCm]      = useState(null);
  const [editCmText,  setEditCmText]  = useState("");
  const [postMenu,    setPostMenu]    = useState(null);

  // Profile
  const [editProfile,  setEditProfile]  = useState(false);
  const [profileForm,  setProfileForm]  = useState({name:"",country:"",ranking:"",tour:"ATP",surface_pref:"",pro_since:"",bio:"",achievements:["","",""]});
  const [inviteEmail,  setInviteEmail]  = useState("");
  const [inviteLink,   setInviteLink]   = useState("");
  const [avatarFile,   setAvatarFile]   = useState(null);
  const [avatarPreview,setAvatarPreview]= useState(null);
  const avatarRef = useRef();

  // Viewing other player profiles
  const [viewingPlayer,     setViewingPlayer]     = useState(null);
  const [viewingPlayerPosts,setViewingPlayerPosts] = useState([]);

  // Cities
  const [tournaments,        setTournaments]        = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [cityPlayers,        setCityPlayers]        = useState([]);
  const [detectedCity,       setDetectedCity]       = useState(null);
  const [locationLoading,    setLocationLoading]    = useState(false);
  const [showCitySearch,     setShowCitySearch]     = useState(false);
  const [citySearch,         setCitySearch]         = useState("");
  const [checkedIn,          setCheckedIn]          = useState(false);
  const [checkInLoading,     setCheckInLoading]     = useState(false);
  const [activeTip,          setActiveTip]          = useState("Training");
  const [showMap,            setShowMap]            = useState(false);
  const mapRef = useRef();

  const inviteCode = new URLSearchParams(window.location.search).get("invite")||"";

  // ── Bootstrap ──────────────────────────────────────────────
  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{
      setSession(session);
      if(session) loadPlayer(session.user.id);
      else setScreen("landing");
    });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_,s)=>{
      setSession(s);
      if(s) loadPlayer(s.user.id);
      else setScreen("landing");
    });
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    const close=()=>{setPostMenu(null);setReactionPicker(null);};
    document.addEventListener("click",close);
    return ()=>document.removeEventListener("click",close);
  },[]);

  useEffect(()=>{
    if(selectedTournament&&showMap&&mapRef.current){
      mapRef.current.src=`https://maps.google.com/maps?q=${selectedTournament.lat},${selectedTournament.lng}&z=14&output=embed&hl=en`;
    }
  },[selectedTournament,showMap]);

  // ── Loaders ────────────────────────────────────────────────
  const loadPlayer = async (uid) => {
    const {data} = await supabase.from("players").select("*").eq("user_id",uid).single();
    if(data){
      setPlayer(data);
      if(data.status==="approved"){
        await Promise.all([loadPosts(),loadTournaments()]);
        setScreen("home");
        detectLocation();
      } else setScreen("pending");
    } else setScreen("landing");
  };

  const loadPosts = async () => {
    const {data} = await supabase.from("posts").select("*").order("created_at",{ascending:false});
    if(data) setPosts(data);
  };

  const loadReactions = async (postIds, uid) => {
    if(!postIds.length) return;
    const {data} = await supabase.from("post_reactions").select("*").in("post_id",postIds);
    if(!data) return;
    const map={};
    postIds.forEach(id=>{map[id]={tennis:0,fire:0,hundred:0,mine:null};});
    data.forEach(r=>{
      if(!map[r.post_id]) map[r.post_id]={tennis:0,fire:0,hundred:0,mine:null};
      map[r.post_id][r.reaction]=(map[r.post_id][r.reaction]||0)+1;
      if(r.user_id===uid) map[r.post_id].mine=r.reaction;
    });
    setReactions(map);
  };

  const loadPollData = async (postIds, uid) => {
    const pollPostIds = posts.filter(p=>p.poll_options&&postIds.includes(p.id)).map(p=>p.id);
    if(!pollPostIds.length) return;
    const {data} = await supabase.from("poll_votes").select("*").in("post_id",pollPostIds);
    if(!data) return;
    const map={};
    pollPostIds.forEach(id=>{map[id]={0:0,1:0,2:0,3:0,myVote:null};});
    data.forEach(v=>{
      if(!map[v.post_id]) return;
      map[v.post_id][v.option_index]=(map[v.post_id][v.option_index]||0)+1;
      if(v.user_id===uid) map[v.post_id].myVote=v.option_index;
    });
    setPollData(map);
  };

  const loadComments = async (pid) => {
    const {data} = await supabase.from("comments").select("*").eq("post_id",pid).order("created_at",{ascending:true});
    if(data) setComments(c=>({...c,[pid]:data}));
  };

  const loadTournaments = async () => {
    const {data} = await supabase.from("tournaments").select("*");
    if(data) setTournaments(data);
  };

  const loadTournamentPlayers = async (tournamentId) => {
    const {data} = await supabase
      .from("tournament_checkins")
      .select("player_id, players(id,name,country,ranking,tour,user_id,avatar_url,bio,surface_pref,pro_since,achievements,current_tournament)")
      .eq("tournament_id",tournamentId);
    if(data){
      setCityPlayers(data.map(d=>d.players).filter(Boolean));
      if(player) setCheckedIn(!!data.find(d=>d.player_id===player.id));
    }
  };

  const loadPending = async () => {
    const {data} = await supabase.from("players").select("*").eq("status","pending").order("created_at",{ascending:false});
    if(data) setPending(data);
  };

  const loadPlayerProfile = async (playerId) => {
    const {data:p} = await supabase.from("players").select("*").eq("id",playerId).single();
    if(p){
      setViewingPlayer(p);
      const {data:pp} = await supabase.from("posts").select("*").eq("user_id",p.user_id).order("created_at",{ascending:false}).limit(10);
      if(pp) setViewingPlayerPosts(pp);
    }
  };

  useEffect(()=>{
    if(posts.length&&player){
      const ids=posts.map(p=>p.id);
      loadReactions(ids,player.user_id);
      loadPollData(ids,player.user_id);
    }
  },[posts,player]);

  // ── Location ───────────────────────────────────────────────
  const detectLocation = () => {
    setLocationLoading(true);
    if(!navigator.geolocation){setLocationLoading(false);return;}
    navigator.geolocation.getCurrentPosition(
      ({coords:{latitude:lat,longitude:lng}})=>{
        setLocationLoading(false);
        if(!tournaments.length) return;
        let nearest=null,minD=Infinity;
        tournaments.forEach(t=>{
          const d=Math.sqrt((t.lat-lat)**2+(t.lng-lng)**2);
          if(d<minD){minD=d;nearest=t;}
        });
        if(nearest&&minD<5) setDetectedCity(nearest.city);
      },
      ()=>setLocationLoading(false),
      {timeout:8000}
    );
  };

  // ── Check-in ───────────────────────────────────────────────
  const handleCheckIn = async () => {
    if(!selectedTournament||!player) return;
    setCheckInLoading(true);
    if(checkedIn){
      await supabase.from("tournament_checkins").delete().eq("player_id",player.id).eq("tournament_id",selectedTournament.id);
      await supabase.from("players").update({current_city:null,current_tournament:null,location_updated_at:null}).eq("id",player.id);
      setPlayer(p=>({...p,current_city:null,current_tournament:null}));
      setCheckedIn(false);
    } else {
      await supabase.from("tournament_checkins").insert([{
        player_id:player.id,
        tournament_id:selectedTournament.id,
        city:selectedTournament.city,
        lat:selectedTournament.lat,
        lng:selectedTournament.lng,
      }]);
      await supabase.from("players").update({
        current_city:selectedTournament.city,
        current_tournament:selectedTournament.tournament_name,
        location_updated_at:new Date().toISOString()
      }).eq("id",player.id);
      setPlayer(p=>({...p,current_city:selectedTournament.city,current_tournament:selectedTournament.tournament_name}));
      setCheckedIn(true);
    }
    await loadTournamentPlayers(selectedTournament.id);
    setCheckInLoading(false);
  };

  const selectTournament = async (t) => {
    setSelectedTournament(t);
    setActiveTip("Training");
    setShowMap(false);
    await loadTournamentPlayers(t.id);
  };

  // ── Auth ───────────────────────────────────────────────────
  const login = async () => {
    setErr("");setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({email:lf.email,password:lf.password});
    setLoading(false);
    if(error) setErr("Invalid email or password.");
  };

  const handleCredFile = (e) => {
    const f=e.target.files[0];if(!f) return;
    setCredFile(f);
    const r=new FileReader();r.onloadend=()=>setCredPreview(r.result);r.readAsDataURL(f);
  };

  const register = async () => {
    if(!rf.name||!rf.ranking||!rf.email||!rf.password){setErr("Please fill in all fields.");return;}
    if(!credFile){setErr("Please upload your ATP/WTA credential.");return;}
    if(rf.password.length<6){setErr("Password must be at least 6 characters.");return;}
    setLoading(true);setErr("");
    const {data:ad,error:ae} = await supabase.auth.signUp({email:rf.email,password:rf.password});
    if(ae){setErr(ae.message);setLoading(false);return;}
    const ext=credFile.name.split(".").pop();
    await supabase.storage.from("credentials").upload(`${ad.user.id}.${ext}`,credFile);
    const {data:ud} = supabase.storage.from("credentials").getPublicUrl(`${ad.user.id}.${ext}`);
    await supabase.from("players").insert([{user_id:ad.user.id,name:rf.name,country:rf.country,ranking:parseInt(rf.ranking),tour:rf.tour,email:rf.email,status:"pending",credential_url:ud.publicUrl,invite_code:inviteCode||null}]);
    setLoading(false);setScreen("pending");
  };

  const logout = async () => {
    await supabase.auth.signOut();setPlayer(null);setSession(null);setScreen("landing");
  };

  // ── Avatar upload ──────────────────────────────────────────
  const handleAvatarFile = (e) => {
    const f=e.target.files[0];if(!f) return;
    setAvatarFile(f);
    const r=new FileReader();r.onloadend=()=>setAvatarPreview(r.result);r.readAsDataURL(f);
  };

  const uploadAvatar = async () => {
    if(!avatarFile||!player) return null;
    const ext=avatarFile.name.split(".").pop();
    const fn=`${player.user_id}.${ext}`;
    const {error} = await supabase.storage.from("avatars").upload(fn,avatarFile,{upsert:true});
    if(error) return null;
    const {data:ud} = supabase.storage.from("avatars").getPublicUrl(fn);
    return ud.publicUrl+"?t="+Date.now();
  };

  const saveProfile = async () => {
    setLoading(true);
    let avatar_url = player.avatar_url;
    if(avatarFile){
      const url = await uploadAvatar();
      if(url) avatar_url=url;
    }
    const {data} = await supabase.from("players").update({
      name:profileForm.name,
      country:profileForm.country,
      ranking:parseInt(profileForm.ranking),
      tour:profileForm.tour,
      surface_pref:profileForm.surface_pref,
      pro_since:profileForm.pro_since?parseInt(profileForm.pro_since):null,
      bio:profileForm.bio,
      achievements:profileForm.achievements.filter(a=>a.trim()),
      avatar_url,
    }).eq("id",player.id).select().single();
    setLoading(false);
    if(data){setPlayer(data);setEditProfile(false);setAvatarFile(null);setAvatarPreview(null);setOk("Profile updated!");setTimeout(()=>setOk(""),3000);}
  };

  // ── Post actions ───────────────────────────────────────────
  const handleMediaFile = (e) => {
    const f=e.target.files[0];if(!f) return;
    setMediaFile(f);setMediaType(f.type.startsWith("video")?"video":"image");
    const r=new FileReader();r.onloadend=()=>setMediaPreview(r.result);r.readAsDataURL(f);
  };

  const submitPost = async () => {
    if(!postText.trim()&&!mediaFile&&!(pollMode&&pollOpts.some(o=>o.trim()))) return;
    let media_url=null,mtype=null;
    if(mediaFile){
      const ext=mediaFile.name.split(".").pop();
      const fn=`posts/${Date.now()}.${ext}`;
      await supabase.storage.from("credentials").upload(fn,mediaFile);
      const {data:ud} = supabase.storage.from("credentials").getPublicUrl(fn);
      media_url=ud.publicUrl;mtype=mediaType;
    }
    const pollOptions=pollMode&&pollOpts.filter(o=>o.trim()).length>=2?pollOpts.filter(o=>o.trim()):null;
    const {data} = await supabase.from("posts").insert([{
      author:player.name,country:player.country,ranking:player.ranking,
      content:postText,category:postCat,likes:0,replies:0,
      user_id:player.user_id,media_url,media_type:mtype,poll_options:pollOptions
    }]).select().single();
    if(data){
      setPosts([data,...posts]);
      setPostText("");setPostCat("Training");
      setMediaFile(null);setMediaPreview(null);setMediaType(null);
      setComposeFocused(false);setPollMode(false);setPollOpts(["",""]);
    }
  };

  const delPost = async (id) => {
    await supabase.from("posts").delete().eq("id",id);
    setPosts(posts.filter(p=>p.id!==id));setPostMenu(null);
  };

  const saveEditPost = async (id) => {
    const {data} = await supabase.from("posts").update({content:editText}).eq("id",id).select().single();
    if(data){setPosts(posts.map(p=>p.id===id?data:p));setEditPost(null);}
  };

  // ── Reactions ──────────────────────────────────────────────
  const doReaction = async (post,reactionId) => {
    const uid=player.user_id;
    const cur=reactions[post.id]||{tennis:0,fire:0,hundred:0,mine:null};
    const isSame=cur.mine===reactionId;
    setPopAnim(a=>({...a,[post.id+reactionId]:true}));
    setTimeout(()=>setPopAnim(a=>({...a,[post.id+reactionId]:false})),300);
    setReactionPicker(null);
    if(isSame){
      await supabase.from("post_reactions").delete().eq("post_id",post.id).eq("user_id",uid);
      setReactions(r=>({...r,[post.id]:{...cur,[reactionId]:Math.max(0,cur[reactionId]-1),mine:null}}));
    } else {
      if(cur.mine) await supabase.from("post_reactions").delete().eq("post_id",post.id).eq("user_id",uid);
      await supabase.from("post_reactions").insert([{post_id:post.id,user_id:uid,reaction:reactionId}]);
      const updated={...cur,[reactionId]:(cur[reactionId]||0)+1,mine:reactionId};
      if(cur.mine) updated[cur.mine]=Math.max(0,(cur[cur.mine]||0)-1);
      setReactions(r=>({...r,[post.id]:updated}));
    }
  };

  const showLikers = async (postId) => {
    const {data} = await supabase.from("post_reactions").select("reaction,user_id,players(id,name,country,ranking,avatar_url)").eq("post_id",postId);
    if(data){
      setLikers(data.map(d=>({...d.players,reaction:d.reaction})).filter(Boolean));
      setLikersModal(postId);
    }
  };

  // ── Polls ──────────────────────────────────────────────────
  const votePoll = async (post,optionIndex) => {
    const uid=player.user_id;
    const cur=pollData[post.id]||{};
    if(cur.myVote!==null&&cur.myVote!==undefined) return;
    await supabase.from("poll_votes").insert([{post_id:post.id,user_id:uid,option_index:optionIndex}]);
    setPollData(pd=>({...pd,[post.id]:{...cur,[optionIndex]:(cur[optionIndex]||0)+1,myVote:optionIndex}}));
  };

  // ── Comments ───────────────────────────────────────────────
  const toggleCms = (pid) => {
    setExpandedCms(x=>({...x,[pid]:!x[pid]}));
    if(!comments[pid]) loadComments(pid);
  };

  const submitCm = async (pid) => {
    const text=cmText[pid];if(!text?.trim()) return;
    const {data} = await supabase.from("comments").insert([{post_id:pid,author:player.name,ranking:player.ranking,content:text,user_id:player.user_id}]).select().single();
    if(data){
      setComments(c=>({...c,[pid]:[...(c[pid]||[]),data]}));
      setCmText(t=>({...t,[pid]:""}));
      const nr=(posts.find(p=>p.id===pid)?.replies||0)+1;
      await supabase.from("posts").update({replies:nr}).eq("id",pid);
      setPosts(posts.map(p=>p.id===pid?{...p,replies:nr}:p));
    }
  };

  const delCm = async (pid,cid) => {
    await supabase.from("comments").delete().eq("id",cid);
    setComments(c=>({...c,[pid]:(c[pid]||[]).filter(x=>x.id!==cid)}));
    const nr=Math.max(0,(posts.find(p=>p.id===pid)?.replies||0)-1);
    await supabase.from("posts").update({replies:nr}).eq("id",pid);
    setPosts(posts.map(p=>p.id===pid?{...p,replies:nr}:p));
  };

  const saveCm = async (pid,cid) => {
    const {data} = await supabase.from("comments").update({content:editCmText}).eq("id",cid).select().single();
    if(data){setComments(c=>({...c,[pid]:(c[pid]||[]).map(x=>x.id===cid?data:x)}));setEditCm(null);}
  };

  // ── Admin ──────────────────────────────────────────────────
  const approve = async (id) => {await supabase.from("players").update({status:"approved"}).eq("id",id);loadPending();};
  const reject  = async (id) => {await supabase.from("players").update({status:"rejected"}).eq("id",id);loadPending();};

  const genInvite = () => {
    if(!inviteEmail.trim()) return;
    const c=Math.random().toString(36).substring(2,10).toUpperCase();
    setInviteLink(`${window.location.origin}?invite=${c}`);
  };

  const ago = (d) => {
    const diff=(Date.now()-new Date(d))/1000;
    if(diff<60)return"now";if(diff<3600)return`${Math.floor(diff/60)}m`;
    if(diff<86400)return`${Math.floor(diff/3600)}h`;return`${Math.floor(diff/86400)}d`;
  };

  // ── Derived ────────────────────────────────────────────────
  const filteredPosts=catFilter==="All"?posts:posts.filter(p=>p.category===catFilter);
  const isAdmin=session?.user?.email===ADMIN_EMAIL;
  const isMyPost=(p)=>p.user_id===player?.user_id;
  const isMyCm=(c)=>c.user_id===player?.user_id;
  const tournamentsByCity=tournaments.reduce((acc,t)=>{if(!acc[t.city])acc[t.city]=[];acc[t.city].push(t);return acc;},{});
  const allCities=Object.keys(tournamentsByCity).sort();
  const filteredCities=citySearch?allCities.filter(c=>c.toLowerCase().includes(citySearch.toLowerCase())):allCities;

  // ── LOADING ────────────────────────────────────────────────
  if(screen==="loading") return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{CSS}</style>
      <div style={{width:24,height:24,border:"2px solid var(--bg3)",borderTopColor:"var(--green)",borderRadius:"50%",animation:"spin 0.7s linear infinite"}}/>
    </div>
  );

  // ── LANDING ────────────────────────────────────────────────
  if(screen==="landing") return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 24px",textAlign:"center",position:"relative",overflow:"hidden"}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",width:600,height:600,background:"radial-gradient(circle,rgba(0,208,132,0.07) 0%,transparent 65%)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",backgroundSize:"48px 48px",pointerEvents:"none"}}/>
      <div className="fu" style={{position:"relative",zIndex:1,maxWidth:480}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(0,208,132,0.08)",border:"1px solid rgba(0,208,132,0.2)",borderRadius:999,padding:"6px 16px",marginBottom:44,fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--green)",fontWeight:600}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",animation:"pulse 2s infinite"}}/>Verified players only
        </div>
        <h1 style={{fontSize:"clamp(48px,9vw,82px)",fontWeight:400,letterSpacing:"-0.04em",lineHeight:0.95,marginBottom:0,color:"var(--text)",fontFamily:"var(--serif)"}}>
          The circle<br/><span style={{fontStyle:"italic",color:"var(--green)"}}>players trust.</span>
        </h1>
        <p style={{fontSize:15,color:"var(--text2)",lineHeight:1.8,margin:"28px auto 48px",maxWidth:300,fontWeight:300}}>A private network for ATP & WTA professionals. Real insights, real players, city by city.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10,maxWidth:280,margin:"0 auto 32px"}}>
          <button onClick={()=>{setErr("");setScreen("register");}} style={{background:"var(--green)",color:"#000",border:"none",borderRadius:12,padding:"16px 32px",fontSize:14,fontWeight:600,boxShadow:"0 0 32px var(--glow)",letterSpacing:"-0.01em"}}>Apply for access</button>
          <button onClick={()=>{setErr("");setScreen("login");}} style={{background:"var(--bg2)",color:"var(--text)",border:"1px solid var(--border)",borderRadius:12,padding:"16px 32px",fontSize:14,fontWeight:400}}>Sign in</button>
        </div>
        <p style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em"}}>🔒 Manual verification · ATP & WTA only</p>
      </div>
    </div>
  );

  // ── LOGIN ──────────────────────────────────────────────────
  if(screen==="login") return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:400}} className="fu">
        <button onClick={()=>setScreen("landing")} style={{background:"transparent",color:"var(--text3)",fontSize:13,marginBottom:36,display:"flex",alignItems:"center",gap:6}}>← Back</button>
        <div style={{fontSize:36,fontWeight:400,marginBottom:6,fontFamily:"var(--serif)"}}>Welcome back</div>
        <div style={{fontSize:14,color:"var(--text2)",marginBottom:36,fontWeight:300}}>Sign in to your PlayerCircle account.</div>
        <Inp label="Email" type="email" placeholder="your@email.com" value={lf.email} onChange={e=>setLf({...lf,email:e.target.value})} onKeyDown={e=>e.key==="Enter"&&login()}/>
        <Inp label="Password" type="password" placeholder="••••••••" value={lf.password} onChange={e=>setLf({...lf,password:e.target.value})} onKeyDown={e=>e.key==="Enter"&&login()}/>
        <ErrBox msg={err}/>
        <GreenBtn onClick={login} disabled={loading}>{loading?"Signing in...":"Sign in"}</GreenBtn>
        <div style={{textAlign:"center",marginTop:24,fontSize:13,color:"var(--text2)",fontWeight:300}}>No account? <button onClick={()=>{setErr("");setScreen("register");}} style={{background:"transparent",color:"var(--green)",fontSize:13,fontWeight:600}}>Apply for access</button></div>
      </div>
    </div>
  );

  // ── REGISTER ───────────────────────────────────────────────
  if(screen==="register") return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 24px"}}>
      <style>{CSS}</style>
      <div style={{width:"100%",maxWidth:420}} className="fu">
        <button onClick={()=>setScreen("landing")} style={{background:"transparent",color:"var(--text3)",fontSize:13,marginBottom:36,display:"flex",alignItems:"center",gap:6}}>← Back</button>
        <div style={{fontSize:32,fontWeight:400,marginBottom:6,fontFamily:"var(--serif)"}}>Apply for access</div>
        <div style={{fontSize:14,color:"var(--text2)",marginBottom:36,fontWeight:300}}>We manually verify every player against ATP/WTA records.</div>
        <Inp label="Full name (as on ATP/WTA profile)" placeholder="e.g. Sebastian Báez" value={rf.name} onChange={e=>setRf({...rf,name:e.target.value})}/>
        <Inp label="Nationality" placeholder="e.g. Argentina" value={rf.country} onChange={e=>setRf({...rf,country:e.target.value})}/>
        <Inp label="Current ranking" type="number" placeholder="e.g. 145" value={rf.ranking} onChange={e=>setRf({...rf,ranking:e.target.value})}/>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>Tour</div>
          <div style={{display:"flex",gap:8}}>
            {["ATP","WTA"].map(t=><button key={t} onClick={()=>setRf({...rf,tour:t})} style={{flex:1,padding:"10px",border:`1px solid ${rf.tour===t?"var(--green)":"var(--border)"}`,background:rf.tour===t?"rgba(0,208,132,0.1)":"transparent",color:rf.tour===t?"var(--green)":"var(--text2)",borderRadius:10,fontSize:13,fontWeight:rf.tour===t?600:400}}>{t}</button>)}
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>ATP/WTA Credential</div>
          <label htmlFor="cred" style={{display:"flex",alignItems:"center",gap:12,border:`1px dashed ${credFile?"var(--green)":"var(--border)"}`,borderRadius:10,padding:16,cursor:"pointer",background:credFile?"rgba(0,208,132,0.05)":"transparent",transition:"all 0.2s"}}>
            <span style={{fontSize:20}}>{credFile?"✓":"📎"}</span>
            <span style={{fontSize:13,color:credFile?"var(--green)":"var(--text3)",fontWeight:300}}>{credFile?credFile.name:"Upload your player credential photo"}</span>
          </label>
          <input id="cred" type="file" accept="image/*" onChange={handleCredFile}/>
          {credPreview&&<img src={credPreview} alt="" style={{width:"100%",marginTop:8,borderRadius:8,maxHeight:120,objectFit:"cover",border:"1px solid var(--border)"}}/>}
        </div>
        <Inp label="Email" type="email" placeholder="your@email.com" value={rf.email} onChange={e=>setRf({...rf,email:e.target.value})}/>
        <Inp label="Password" type="password" placeholder="Min. 6 characters" value={rf.password} onChange={e=>setRf({...rf,password:e.target.value})}/>
        {inviteCode&&<div style={{fontSize:12,color:"var(--green)",marginBottom:16,padding:"10px 12px",background:"rgba(0,208,132,0.08)",borderRadius:8,border:"1px solid rgba(0,208,132,0.2)"}}>✓ Invited with code: {inviteCode}</div>}
        <ErrBox msg={err}/>
        <GreenBtn onClick={register} disabled={loading}>{loading?"Submitting...":"Submit application"}</GreenBtn>
        <div style={{textAlign:"center",marginTop:24,fontSize:13,color:"var(--text2)",fontWeight:300}}>Already a member? <button onClick={()=>{setErr("");setScreen("login");}} style={{background:"transparent",color:"var(--green)",fontSize:13,fontWeight:600}}>Sign in</button></div>
      </div>
    </div>
  );

  if(screen==="pending") return (
    <div style={{background:"var(--bg)",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:40,textAlign:"center"}}>
      <style>{CSS}</style>
      <div className="fu">
        <div style={{width:64,height:64,background:"rgba(0,208,132,0.1)",border:"1px solid rgba(0,208,132,0.2)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 auto 24px"}}>⏳</div>
        <div style={{fontSize:28,fontFamily:"var(--serif)",marginBottom:12}}>Under review</div>
        <div style={{fontSize:14,color:"var(--text2)",lineHeight:1.7,maxWidth:280,margin:"0 auto 32px",fontWeight:300}}>We're verifying your ATP/WTA credentials. Usually 24–48 hours.</div>
        <button onClick={logout} style={{background:"var(--bg2)",color:"var(--text2)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 24px",fontSize:13}}>Sign out</button>
      </div>
    </div>
  );

  // ── PLAYER PROFILE VIEW ────────────────────────────────────
  const PlayerProfileView = ({p, onClose}) => {
    const myPosts=viewingPlayerPosts;
    const totalRxn=myPosts.length;
    return (
      <div style={{position:"fixed",inset:0,background:"var(--bg)",zIndex:100,overflowY:"auto"}} className="fi">
        <div style={{position:"sticky",top:0,background:"rgba(10,10,11,0.94)",backdropFilter:"blur(20px)",borderBottom:"1px solid var(--border2)",padding:"16px 20px",display:"flex",alignItems:"center",gap:12,zIndex:10}}>
          <button onClick={onClose} style={{background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--text2)",borderRadius:10,padding:"8px 14px",fontSize:12}}>← Back</button>
          <div style={{flex:1,fontSize:14,fontWeight:600}}>{p.name}</div>
          {/* Chat button placeholder */}
          <button style={{background:"rgba(0,208,132,0.1)",border:"1px solid rgba(0,208,132,0.2)",color:"var(--green)",borderRadius:10,padding:"8px 14px",fontSize:12,fontWeight:600}}>Message</button>
        </div>

        <div style={{padding:"24px 20px 120px"}}>
          {/* Hero */}
          <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:24}}>
            <Avatar src={p.avatar_url} name={p.name} size={72} glow={true} flag={getFlag(p.country)}/>
            <div style={{flex:1}}>
              <div style={{fontSize:22,fontWeight:400,fontFamily:"var(--serif)",marginBottom:4}}>{p.name}</div>
              <div style={{fontSize:13,color:"var(--text2)",marginBottom:6,fontWeight:300}}>{p.country} · {p.tour}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                <div style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:999,color:"var(--green)",background:"rgba(0,208,132,0.1)",border:"1px solid rgba(0,208,132,0.2)"}}>Rank #{p.ranking}</div>
                {p.surface_pref&&<div style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:999,color:SURFACE_COLOR[p.surface_pref]||"var(--text2)",background:`${SURFACE_COLOR[p.surface_pref]||"#666"}15`,border:`1px solid ${SURFACE_COLOR[p.surface_pref]||"#666"}33`}}>{p.surface_pref}</div>}
                {p.pro_since&&<div style={{fontSize:11,padding:"3px 10px",borderRadius:999,color:"var(--text3)",background:"var(--bg2)",border:"1px solid var(--border)"}}>Pro since {p.pro_since}</div>}
              </div>
            </div>
          </div>

          {/* Current location */}
          {p.current_tournament&&(
            <div style={{background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:8,height:8,borderRadius:"50%",background:"#a78bfa",animation:"pulse 2s infinite",flexShrink:0}}/>
              <div>
                <div style={{fontSize:12,color:"#a78bfa",fontWeight:600}}>Currently at</div>
                <div style={{fontSize:13,color:"var(--text)",fontWeight:400}}>{p.current_tournament}</div>
              </div>
            </div>
          )}

          {/* Bio */}
          {p.bio&&(
            <div style={{background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:14,padding:"16px",marginBottom:16}}>
              <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.7,fontWeight:300}}>{p.bio}</div>
            </div>
          )}

          {/* Achievements */}
          {p.achievements?.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Career highlights</div>
              {p.achievements.map((a,i)=>a&&(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:10,marginBottom:6}}>
                  <span style={{fontSize:14}}>🏆</span>
                  <span style={{fontSize:13,color:"var(--text)",fontWeight:400}}>{a}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats row */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
            {[["Posts",myPosts.length],["Ranking",`#${p.ranking}`]].map(([l,v])=>(
              <div key={l} style={{background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:12,padding:"14px",textAlign:"center"}}>
                <div style={{fontSize:22,fontWeight:700,color:"var(--green)",fontFamily:"var(--serif)"}}>{v}</div>
                <div style={{fontSize:10,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:3}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Recent posts */}
          {myPosts.length>0&&(
            <>
              <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Recent posts</div>
              {myPosts.slice(0,5).map(post=>{
                const cat=getCat(post.category);
                return (
                  <div key={post.id} style={{background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:14,padding:"14px 16px",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                      <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:999,color:cat.color,background:cat.bg,border:`1px solid ${cat.color}22`}}>{cat.icon} {cat.label}</div>
                      <span style={{fontSize:11,color:"var(--text3)"}}>{ago(post.created_at)}</span>
                    </div>
                    <div style={{fontSize:13,lineHeight:1.65,color:"var(--text)",fontWeight:300}}>{post.content}</div>
                    {post.media_url&&post.media_type==="image"&&<img src={post.media_url} alt="" style={{width:"100%",borderRadius:8,marginTop:10,maxHeight:160,objectFit:"cover",border:"1px solid var(--border)"}}/>}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  };

  // ── MODALS ─────────────────────────────────────────────────
  const ProfileEditModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,backdropFilter:"blur(8px)"}} onClick={()=>setEditProfile(false)}>
      <div className="su" style={{width:"100%",maxWidth:480,background:"var(--bg1)",borderRadius:"20px 20px 0 0",padding:"24px 24px 44px",border:"1px solid var(--border)",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:"var(--bg3)",borderRadius:999,margin:"0 auto 24px"}}/>
        <div style={{fontSize:20,fontFamily:"var(--serif)",marginBottom:20}}>Edit profile</div>

        {/* Avatar upload */}
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24,padding:"16px",background:"var(--bg2)",borderRadius:14,border:"1px solid var(--border)"}}>
          <Avatar src={avatarPreview||player?.avatar_url} name={player?.name} size={56}/>
          <div>
            <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>Profile photo</div>
            <label htmlFor="avatar-upload" style={{fontSize:12,color:"var(--green)",fontWeight:600,cursor:"pointer"}}>Change photo</label>
            <input id="avatar-upload" type="file" accept="image/*" ref={avatarRef} onChange={handleAvatarFile}/>
          </div>
        </div>

        <Inp label="Full name" value={profileForm.name} onChange={e=>setProfileForm({...profileForm,name:e.target.value})}/>
        <Inp label="Nationality" value={profileForm.country} onChange={e=>setProfileForm({...profileForm,country:e.target.value})}/>
        <Inp label="Current ranking" type="number" value={profileForm.ranking} onChange={e=>setProfileForm({...profileForm,ranking:e.target.value})}/>
        <Inp label="Pro since (year)" type="number" placeholder="e.g. 2016" value={profileForm.pro_since} onChange={e=>setProfileForm({...profileForm,pro_since:e.target.value})}/>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>Tour</div>
          <div style={{display:"flex",gap:8}}>
            {["ATP","WTA"].map(t=><button key={t} onClick={()=>setProfileForm({...profileForm,tour:t})} style={{flex:1,padding:"10px",border:`1px solid ${profileForm.tour===t?"var(--green)":"var(--border)"}`,background:profileForm.tour===t?"rgba(0,208,132,0.1)":"transparent",color:profileForm.tour===t?"var(--green)":"var(--text2)",borderRadius:10,fontSize:13,fontWeight:profileForm.tour===t?600:400}}>{t}</button>)}
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>Favourite surface</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {SURFACES.map(s=><button key={s} onClick={()=>setProfileForm({...profileForm,surface_pref:s})} style={{padding:"7px 14px",border:`1px solid ${profileForm.surface_pref===s?SURFACE_COLOR[s]:"var(--border)"}`,background:profileForm.surface_pref===s?`${SURFACE_COLOR[s]}15`:"transparent",color:profileForm.surface_pref===s?SURFACE_COLOR[s]:"var(--text3)",borderRadius:8,fontSize:12,fontWeight:profileForm.surface_pref===s?600:400}}>{s}</button>)}
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>Bio</div>
          <textarea style={{width:"100%",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 14px",color:"var(--text)",fontSize:13,resize:"none",minHeight:80,lineHeight:1.6}} placeholder="A few words about you..." value={profileForm.bio} onChange={e=>setProfileForm({...profileForm,bio:e.target.value})}/>
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6,fontWeight:600}}>Career highlights (up to 3)</div>
          {profileForm.achievements.map((a,i)=>(
            <input key={i} style={{width:"100%",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",color:"var(--text)",fontSize:13,marginBottom:8}} placeholder={`e.g. Top 50 ATP 2023`} value={a} onChange={e=>{const n=[...profileForm.achievements];n[i]=e.target.value;setProfileForm({...profileForm,achievements:n});}}/>
          ))}
        </div>

        <div style={{display:"flex",gap:8}}>
          <GreenBtn onClick={saveProfile}>{loading?"Saving...":"Save changes"}</GreenBtn>
          <button onClick={()=>setEditProfile(false)} style={{flex:1,background:"var(--bg2)",color:"var(--text2)",border:"1px solid var(--border)",borderRadius:10,padding:"13px",fontSize:14}}>Cancel</button>
        </div>
      </div>
    </div>
  );

  const LikersModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"flex-end",justifyContent:"center",zIndex:200,backdropFilter:"blur(8px)"}} onClick={()=>setLikersModal(null)}>
      <div className="su" style={{width:"100%",maxWidth:480,background:"var(--bg1)",borderRadius:"20px 20px 0 0",padding:"24px 24px 44px",border:"1px solid var(--border)",maxHeight:"70vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:36,height:4,background:"var(--bg3)",borderRadius:999,margin:"0 auto 20px"}}/>
        <div style={{fontSize:18,fontFamily:"var(--serif)",marginBottom:16}}>Reactions · {likers.length}</div>
        {likers.length===0&&<div style={{textAlign:"center",color:"var(--text3)",padding:"20px 0",fontWeight:300}}>No reactions yet.</div>}
        {likers.map((l,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:"1px solid var(--border2)"}}>
            <Avatar src={l.avatar_url} name={l.name} size={38} flag={getFlag(l.country)}/>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:500}}>{l.name}</div>
              <div style={{fontSize:11,color:"var(--text3)",fontWeight:300}}>#{l.ranking} · {l.country}</div>
            </div>
            <span style={{fontSize:22}}>{REACTIONS.find(r=>r.id===l.reaction)?.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── BOTTOM NAV ─────────────────────────────────────────────
  const navItems=[
    {id:"feed",    label:"Home",    icon:(a)=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke={a?"var(--green)":"var(--text3)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>},
    {id:"cities",  label:"Discover",icon:(a)=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" stroke={a?"var(--green)":"var(--text3)"} strokeWidth="1.8"/><path d="M20 20l-3-3" stroke={a?"var(--green)":"var(--text3)"} strokeWidth="1.8" strokeLinecap="round"/></svg>},
    {id:"profile", label:"Profile", icon:(a)=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" stroke={a?"var(--green)":"var(--text3)"} strokeWidth="1.8"/><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={a?"var(--green)":"var(--text3)"} strokeWidth="1.8" strokeLinecap="round"/></svg>},
    ...(isAdmin?[{id:"admin",label:"Admin",icon:(a)=><svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={a?"#f59e0b":"var(--text3)"} strokeWidth="1.8" strokeLinejoin="round"/></svg>}]:[]),
  ];

  const BottomNav=()=>(
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(10,10,11,0.95)",backdropFilter:"blur(24px)",borderTop:"1px solid var(--border)",display:"flex",zIndex:50,maxWidth:480,margin:"0 auto",paddingBottom:"env(safe-area-inset-bottom,0px)"}}>
      {navItems.map(item=>(
        <button key={item.id} onClick={()=>setTab(item.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"12px 8px 14px",background:"transparent"}}>
          {item.icon(tab===item.id)}
          <span style={{fontSize:9,letterSpacing:"0.06em",textTransform:"uppercase",color:tab===item.id?(item.id==="admin"?"#f59e0b":"var(--green)"):"var(--text3)",fontWeight:tab===item.id?700:400}}>{item.label}</span>
        </button>
      ))}
    </div>
  );

  // ── FEED TAB ───────────────────────────────────────────────
  const FeedTab=()=>(
    <div style={{paddingBottom:120}}>
      {/* Category tab bar */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",borderBottom:"1px solid var(--border2)",background:"var(--bg1)"}}>
        {CATS.map(c=>(
          <button key={c.id} onClick={()=>setCatFilter(c.id)} style={{padding:"11px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"transparent",borderBottom:`2px solid ${catFilter===c.id?c.color:"transparent"}`,transition:"all 0.15s"}}>
            {c.icon&&<span style={{fontSize:13}}>{c.icon}</span>}
            <span style={{fontSize:10,letterSpacing:"0.03em",color:catFilter===c.id?c.color:"var(--text3)",fontWeight:catFilter===c.id?700:400,whiteSpace:"nowrap"}}>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Compose */}
      <div style={{margin:"12px 16px 8px",background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden"}}>
        <div style={{padding:"14px 16px"}}>
          <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <Avatar src={player?.avatar_url} name={player?.name} size={36} flag={getFlag(player?.country)}/>
            <textarea style={{flex:1,background:"transparent",border:"none",color:"var(--text)",fontSize:14,resize:"none",lineHeight:1.6,minHeight:composeFocused?80:40,transition:"min-height 0.2s ease",fontWeight:300}} placeholder="Share something with the circle..." value={postText} onChange={e=>setPostText(e.target.value)} onFocus={()=>setComposeFocused(true)}/>
          </div>
          {mediaPreview&&(
            <div style={{position:"relative",marginTop:12,marginLeft:48}}>
              {mediaType==="video"?<video src={mediaPreview} controls style={{width:"100%",borderRadius:10,border:"1px solid var(--border)",maxHeight:200}}/>:<img src={mediaPreview} alt="" style={{width:"100%",borderRadius:10,border:"1px solid var(--border)",maxHeight:200,objectFit:"cover"}}/>}
              <button onClick={()=>{setMediaFile(null);setMediaPreview(null);setMediaType(null);}} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.6)",color:"#fff",borderRadius:"50%",width:24,height:24,fontSize:12,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
            </div>
          )}
          {pollMode&&(
            <div style={{marginTop:12,marginLeft:48}}>
              {pollOpts.map((opt,i)=>(
                <input key={i} style={{width:"100%",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 12px",color:"var(--text)",fontSize:13,marginBottom:6}} placeholder={`Option ${i+1}`} value={opt} onChange={e=>{const n=[...pollOpts];n[i]=e.target.value;setPollOpts(n);}}/>
              ))}
              {pollOpts.length<4&&<button onClick={()=>setPollOpts([...pollOpts,""])} style={{background:"transparent",color:"var(--green)",fontSize:12,fontWeight:600,padding:"4px 0"}}>+ Add option</button>}
            </div>
          )}
        </div>
        {(composeFocused||postText||mediaPreview||pollMode)&&(
          <div style={{padding:"10px 16px 14px",borderTop:"1px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <button onClick={()=>mediaRef.current?.click()} style={{background:"transparent",color:"var(--text3)",fontSize:18}}>📷</button>
              <input ref={mediaRef} type="file" accept="image/*,video/*" onChange={handleMediaFile}/>
              <button onClick={()=>setPollMode(!pollMode)} style={{background:pollMode?"rgba(167,139,250,0.15)":"transparent",border:pollMode?"1px solid rgba(167,139,250,0.3)":"none",color:pollMode?"#a78bfa":"var(--text3)",borderRadius:8,padding:"4px 10px",fontSize:12,fontWeight:600}}>📊</button>
              <select value={postCat} onChange={e=>setPostCat(e.target.value)} style={{background:"var(--bg2)",border:"1px solid var(--border)",color:getCat(postCat).color,borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:600}}>
                {CATS.filter(c=>c.id!=="All").map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <button onClick={submitPost} style={{background:"var(--green)",color:"#000",border:"none",borderRadius:10,padding:"8px 20px",fontSize:13,fontWeight:600,boxShadow:"0 0 16px var(--glow)",flexShrink:0}}>Post</button>
          </div>
        )}
      </div>

      {filteredPosts.length===0&&(
        <div style={{textAlign:"center",padding:"60px 24px",color:"var(--text3)"}}>
          <div style={{fontSize:36,marginBottom:12}}>✦</div>
          <div style={{fontSize:14,fontWeight:300}}>No posts yet. Be the first.</div>
        </div>
      )}

      {filteredPosts.map((post,i)=>{
        const cat=getCat(post.category);
        const rxn=reactions[post.id]||{tennis:0,fire:0,hundred:0,mine:null};
        const totalRxn=(rxn.tennis||0)+(rxn.fire||0)+(rxn.hundred||0);
        const pd=pollData[post.id];
        const pollOpts_=post.poll_options||[];
        const totalVotes=pd?pollOpts_.reduce((_,__,idx)=>(pd[idx]||0)+_,0):0;
        const hasVoted=pd?.myVote!==null&&pd?.myVote!==undefined;

        return (
          <div key={post.id} className="post" style={{margin:"0 16px 10px",background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:16,overflow:"hidden",animationDelay:`${i*0.03}s`}}>
            <div style={{padding:"14px 16px 0",display:"flex",alignItems:"flex-start",gap:10}}>
              <button onClick={()=>{const p=posts.find(x=>x.user_id===post.user_id);if(post.user_id!==player?.user_id){loadPlayerProfile&&loadPlayerProfile(post.user_id)}}} style={{background:"transparent",padding:0}}>
                <Avatar src={null} name={post.author} size={38} flag={getFlag(post.country)}/>
              </button>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontSize:14,fontWeight:500}}>{post.author}</span>
                  <span style={{fontSize:11,color:"var(--text3)",fontWeight:300}}>#{post.ranking} · {ago(post.created_at)}</span>
                  <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:999,color:cat.color,background:cat.bg,border:`1px solid ${cat.color}22`}}>{cat.icon} {cat.label}</div>
                </div>
              </div>
              {isMyPost(post)&&(
                <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>setPostMenu(postMenu===post.id?null:post.id)} style={{background:"transparent",color:"var(--text3)",fontSize:20,padding:"0 4px",letterSpacing:"1px",lineHeight:1}}>···</button>
                  {postMenu===post.id&&(
                    <div className="fi" style={{position:"absolute",right:0,top:"calc(100% + 4px)",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:12,padding:4,zIndex:20,minWidth:140,boxShadow:"0 8px 32px rgba(0,0,0,0.5)"}}>
                      <button onClick={()=>{setEditPost(post.id);setEditText(post.content);setPostMenu(null);}} style={{display:"block",width:"100%",textAlign:"left",background:"transparent",color:"var(--text)",padding:"9px 14px",fontSize:13,borderRadius:8}}>Edit post</button>
                      <button onClick={()=>delPost(post.id)} style={{display:"block",width:"100%",textAlign:"left",background:"transparent",color:"#ef4444",padding:"9px 14px",fontSize:13,borderRadius:8}}>Delete post</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div style={{padding:"10px 16px 12px",paddingLeft:64}}>
              {editPost===post.id?(
                <>
                  <textarea style={{width:"100%",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,color:"var(--text)",fontSize:14,padding:"10px 12px",resize:"none",minHeight:80,marginBottom:10,lineHeight:1.6}} value={editText} onChange={e=>setEditText(e.target.value)}/>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>saveEditPost(post.id)} style={{background:"var(--green)",color:"#000",border:"none",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:600}}>Save</button>
                    <button onClick={()=>setEditPost(null)} style={{background:"var(--bg2)",color:"var(--text2)",border:"1px solid var(--border)",borderRadius:8,padding:"8px 16px",fontSize:12}}>Cancel</button>
                  </div>
                </>
              ):(
                <div style={{fontSize:14,lineHeight:1.75,color:"var(--text)",whiteSpace:"pre-wrap",fontWeight:300}}>{post.content}</div>
              )}
            </div>

            {post.media_url&&(
              <div style={{margin:"0 16px 12px"}}>
                {post.media_type==="video"?<video src={post.media_url} controls style={{width:"100%",borderRadius:10,border:"1px solid var(--border)",maxHeight:300}}/>:<img src={post.media_url} alt="" style={{width:"100%",borderRadius:10,border:"1px solid var(--border)",maxHeight:300,objectFit:"cover"}}/>}
              </div>
            )}

            {pollOpts_.length>=2&&(
              <div style={{margin:"0 16px 14px"}}>
                {pollOpts_.map((opt,idx)=>{
                  const votes=pd?.[idx]||0;
                  const pct=totalVotes>0?Math.round((votes/totalVotes)*100):0;
                  const isMyVote=pd?.myVote===idx;
                  return (
                    <button key={idx} onClick={()=>!hasVoted&&votePoll(post,idx)} disabled={hasVoted} style={{width:"100%",marginBottom:6,background:"transparent",border:`1px solid ${isMyVote?"var(--green)":"var(--border)"}`,borderRadius:10,padding:"10px 14px",textAlign:"left",position:"relative",overflow:"hidden",cursor:hasVoted?"default":"pointer"}}>
                      {hasVoted&&<div style={{position:"absolute",left:0,top:0,height:"100%",width:`${pct}%`,background:isMyVote?"rgba(0,208,132,0.12)":"rgba(255,255,255,0.04)",borderRadius:10,transition:"width 0.5s ease"}}/>}
                      <div style={{position:"relative",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:13,color:isMyVote?"var(--green)":"var(--text)",fontWeight:isMyVote?600:300}}>{opt}</span>
                        {hasVoted&&<span style={{fontSize:12,color:isMyVote?"var(--green)":"var(--text3)",fontWeight:600}}>{pct}%</span>}
                      </div>
                    </button>
                  );
                })}
                <div style={{fontSize:11,color:"var(--text3)",marginTop:4,fontWeight:300}}>{totalVotes} vote{totalVotes!==1?"s":""}{hasVoted?" · You voted":""}</div>
              </div>
            )}

            <div style={{display:"flex",alignItems:"center",padding:"8px 12px",borderTop:"1px solid var(--border2)",gap:2}}>
              <div style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
                <button onClick={()=>setReactionPicker(reactionPicker===post.id?null:post.id)} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",color:rxn.mine?"var(--green)":"var(--text3)",fontSize:13,padding:"6px 10px",borderRadius:10,fontWeight:rxn.mine?600:300}}>
                  <span style={{fontSize:16}}>{rxn.mine?REACTIONS.find(r=>r.id===rxn.mine)?.emoji:"🎾"}</span>
                  {totalRxn>0&&<span>{totalRxn}</span>}
                </button>
                {reactionPicker===post.id&&(
                  <div className="fi" style={{position:"absolute",bottom:"calc(100% + 8px)",left:0,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:14,padding:"8px 12px",display:"flex",gap:4,boxShadow:"0 8px 32px rgba(0,0,0,0.5)",zIndex:30}}>
                    {REACTIONS.map(r=>(
                      <button key={r.id} onClick={()=>doReaction(post,r.id)} className={popAnim[post.id+r.id]?"pop":""} style={{background:rxn.mine===r.id?"rgba(0,208,132,0.15)":"transparent",border:`1px solid ${rxn.mine===r.id?"var(--green)":"transparent"}`,borderRadius:10,padding:"6px 8px",display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                        <span style={{fontSize:22}}>{r.emoji}</span>
                        <span style={{fontSize:9,color:"var(--text3)"}}>{rxn[r.id]||0}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {totalRxn>0&&<button onClick={()=>showLikers(post.id)} style={{background:"transparent",color:"var(--text3)",fontSize:11,padding:"6px 8px",borderRadius:8,fontWeight:300}}>See who</button>}
              <button onClick={()=>toggleCms(post.id)} style={{display:"flex",alignItems:"center",gap:6,background:"transparent",color:expandedCms[post.id]?"var(--green)":"var(--text3)",fontSize:13,padding:"6px 12px",borderRadius:10,marginLeft:"auto"}}>
                💬 {post.replies||0}
              </button>
            </div>

            {expandedCms[post.id]&&(
              <div style={{borderTop:"1px solid var(--border2)",padding:"14px 16px",background:"rgba(0,0,0,0.2)"}}>
                {(comments[post.id]||[]).length===0&&<div style={{fontSize:12,color:"var(--text3)",textAlign:"center",marginBottom:12,fontWeight:300}}>No replies yet.</div>}
                {(comments[post.id]||[]).map(c=>(
                  <div key={c.id} style={{display:"flex",gap:8,marginBottom:12}}>
                    <Avatar name={c.author} size={28}/>
                    <div style={{flex:1,background:"var(--bg2)",borderRadius:12,padding:"8px 12px",border:"1px solid var(--border)"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                        <span style={{fontSize:11,fontWeight:500}}>{c.author} <span style={{color:"var(--text3)",fontWeight:300}}>· #{c.ranking}</span></span>
                        {isMyCm(c)&&<div style={{display:"flex",gap:8}}>
                          <button onClick={()=>{setEditCm(c.id);setEditCmText(c.content);}} style={{background:"transparent",color:"var(--text3)",fontSize:11}}>Edit</button>
                          <button onClick={()=>delCm(post.id,c.id)} style={{background:"transparent",color:"#ef4444",fontSize:11}}>Delete</button>
                        </div>}
                      </div>
                      {editCm===c.id?(
                        <div>
                          <input style={{width:"100%",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:8,padding:"6px 10px",color:"var(--text)",fontSize:13,marginBottom:6}} value={editCmText} onChange={e=>setEditCmText(e.target.value)}/>
                          <div style={{display:"flex",gap:6}}>
                            <button onClick={()=>saveCm(post.id,c.id)} style={{background:"var(--green)",color:"#000",border:"none",borderRadius:6,padding:"4px 12px",fontSize:11,fontWeight:600}}>Save</button>
                            <button onClick={()=>setEditCm(null)} style={{background:"var(--bg2)",color:"var(--text2)",border:"1px solid var(--border)",borderRadius:6,padding:"4px 12px",fontSize:11}}>Cancel</button>
                          </div>
                        </div>
                      ):(
                        <div style={{fontSize:13,color:"var(--text)",lineHeight:1.55,fontWeight:300}}>{c.content}</div>
                      )}
                    </div>
                  </div>
                ))}
                <div style={{display:"flex",gap:8,alignItems:"center",marginTop:8}}>
                  <Avatar src={player?.avatar_url} name={player?.name} size={28}/>
                  <input style={{flex:1,background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:999,padding:"8px 14px",color:"var(--text)",fontSize:13,fontWeight:300}} placeholder="Write a reply..." value={cmText[post.id]||""} onChange={e=>setCmText(t=>({...t,[post.id]:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&submitCm(post.id)}/>
                  <button onClick={()=>submitCm(post.id)} style={{background:"var(--green)",color:"#000",border:"none",borderRadius:"50%",width:32,height:32,fontSize:14,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>↑</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // ── CITIES TAB ─────────────────────────────────────────────
  const CitiesTab=()=>{
    const tips=selectedTournament?(CITY_TIPS[selectedTournament.city]||[]):[];
    const tipCats=[...new Set(tips.map(t=>t.cat))];
    const visibleTips=tips.filter(t=>t.cat===activeTip);
    const cityTs=selectedTournament?(tournamentsByCity[selectedTournament.city]||[]).sort((a,b)=>(CAT_RANK[a.category]||9)-(CAT_RANK[b.category]||9)):[];

    if(selectedTournament) return (
      <div style={{paddingBottom:120}}>
        <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid var(--border2)"}}>
          <button onClick={()=>{setSelectedTournament(null);setCityPlayers([]);setShowMap(false);}} style={{background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--text2)",borderRadius:10,padding:"8px 14px",fontSize:12}}>← Back</button>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:500,fontFamily:"var(--serif)"}}>{selectedTournament.tournament_name}</div>
            <div style={{fontSize:11,color:"var(--text3)",fontWeight:300}}>{selectedTournament.city}, {selectedTournament.country}</div>
          </div>
          <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"3px 9px",borderRadius:999,color:SURFACE_COLOR[selectedTournament.surface],background:`${SURFACE_COLOR[selectedTournament.surface]}18`,border:`1px solid ${SURFACE_COLOR[selectedTournament.surface]}33`}}>{selectedTournament.surface}</div>
        </div>

        <div style={{display:"flex",gap:8,padding:"12px 16px",overflowX:"auto",borderBottom:"1px solid var(--border2)"}}>
          {[["Category",selectedTournament.category],["Prize",selectedTournament.prize_money],["Month",MONTHS[selectedTournament.month-1]],["Tour",selectedTournament.tour]].map(([l,v])=>(
            <div key={l} style={{flexShrink:0,background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",textAlign:"center"}}>
              <div style={{fontSize:12,fontWeight:500,color:"var(--text)",whiteSpace:"nowrap"}}>{v}</div>
              <div style={{fontSize:9,color:"var(--text3)",textTransform:"uppercase",letterSpacing:"0.08em",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Check in + players here */}
        <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border2)"}}>
          <button onClick={handleCheckIn} disabled={checkInLoading} style={{width:"100%",background:checkedIn?"rgba(0,208,132,0.1)":"var(--green)",color:checkedIn?"var(--green)":"#000",border:`1px solid ${checkedIn?"var(--green)":"transparent"}`,borderRadius:12,padding:"13px",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:checkedIn?"none":"0 0 24px var(--glow)"}}>
            {checkInLoading?"...":(checkedIn?"✓ You're here · Tap to leave":"📍 I'm at this tournament")}
          </button>
          {cityPlayers.length>0&&(
            <div style={{marginTop:14}}>
              <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Players here · {cityPlayers.length}</div>
              <div style={{display:"flex",gap:12,overflowX:"auto"}}>
                {cityPlayers.map((p,i)=>(
                  <button key={i} onClick={()=>loadPlayerProfile(p.id)} style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"transparent",padding:0}}>
                    <Avatar src={p.avatar_url} name={p.name} size={44} flag={getFlag(p.country)}/>
                    <div style={{fontSize:9,color:"var(--text2)",textAlign:"center",maxWidth:48,lineHeight:1.3,fontWeight:400}}>{p.name?.split(" ")[0]}</div>
                    <div style={{fontSize:9,color:"var(--text3)",fontWeight:300}}>#{p.ranking}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {cityTs.length>1&&(
          <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border2)"}}>
            <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8,fontWeight:600}}>Also in {selectedTournament.city}</div>
            <div style={{display:"flex",gap:8,overflowX:"auto"}}>
              {cityTs.filter(t=>t.id!==selectedTournament.id).map(t=>(
                <button key={t.id} onClick={()=>selectTournament(t)} style={{flexShrink:0,background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",textAlign:"left"}}>
                  <div style={{fontSize:12,fontWeight:500,color:"var(--text)",whiteSpace:"nowrap"}}>{t.tournament_name}</div>
                  <div style={{fontSize:10,color:"var(--text3)",marginTop:2,fontWeight:300}}>{t.category}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{padding:"12px 16px",borderBottom:"1px solid var(--border2)"}}>
          <button onClick={()=>setShowMap(!showMap)} style={{width:"100%",background:"var(--bg1)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:12,padding:"12px",fontSize:13,fontWeight:400,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            🗺️ {showMap?"Hide map":`Map · ${selectedTournament.venue}`}
          </button>
          {showMap&&<div style={{marginTop:10,borderRadius:12,overflow:"hidden",border:"1px solid var(--border)",height:220}}><iframe ref={mapRef} width="100%" height="220" style={{border:0,display:"block"}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="map"/></div>}
        </div>

        {tips.length>0&&(
          <div style={{padding:"14px 0"}}>
            <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,fontWeight:600,padding:"0 16px"}}>City guide</div>
            <div style={{display:"flex",gap:8,padding:"0 16px 12px",overflowX:"auto"}}>
              {tipCats.map(tc=><button key={tc} onClick={()=>setActiveTip(tc)} style={{whiteSpace:"nowrap",padding:"6px 14px",borderRadius:999,border:`1px solid ${activeTip===tc?"var(--green)":"var(--border)"}`,background:activeTip===tc?"rgba(0,208,132,0.1)":"transparent",color:activeTip===tc?"var(--green)":"var(--text3)",fontSize:11,fontWeight:activeTip===tc?600:400}}>{tc}</button>)}
            </div>
            <div style={{padding:"0 16px"}}>
              {visibleTips.length===0&&<div style={{textAlign:"center",padding:"24px",color:"var(--text3)",fontSize:13,fontWeight:300}}>No tips yet for this city.</div>}
              {visibleTips.map((tip,i)=>(
                <div key={i} className="fu" style={{background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:14,padding:"14px 16px",marginBottom:8,display:"flex",gap:12,animationDelay:`${i*0.06}s`}}>
                  <div style={{width:40,height:40,background:"var(--bg2)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{tip.icon}</div>
                  <div style={{fontSize:13,lineHeight:1.7,color:"var(--text)",fontWeight:300}}>{tip.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div style={{paddingBottom:120}}>
        <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border2)"}}>
          {detectedCity?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:"var(--green)",animation:"pulse 2s infinite"}}/>
                <span style={{fontSize:13,color:"var(--text)",fontWeight:300}}>Near <strong style={{fontWeight:500}}>{detectedCity}</strong></span>
              </div>
              <button onClick={()=>setShowCitySearch(!showCitySearch)} style={{background:"transparent",color:"var(--green)",fontSize:12,fontWeight:600}}>Change</button>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:13,color:"var(--text2)",fontWeight:300}}>{locationLoading?"Detecting location...":"Where are you?"}</span>
              <div style={{display:"flex",gap:8}}>
                {!locationLoading&&<button onClick={detectLocation} style={{background:"rgba(0,208,132,0.1)",border:"1px solid rgba(0,208,132,0.2)",color:"var(--green)",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:600}}>📍 GPS</button>}
                <button onClick={()=>setShowCitySearch(!showCitySearch)} style={{background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--text2)",borderRadius:8,padding:"6px 12px",fontSize:11}}>Search</button>
              </div>
            </div>
          )}
          {showCitySearch&&<input style={{width:"100%",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",color:"var(--text)",fontSize:13,marginTop:10,fontWeight:300}} placeholder="Search city or tournament..." value={citySearch} onChange={e=>setCitySearch(e.target.value)} autoFocus/>}
        </div>

        {!citySearch&&(
          <div style={{padding:"16px 16px 0"}}>
            <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Grand Slams</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
              {tournaments.filter(t=>t.category==="Grand Slam").map(t=>(
                <button key={t.id} onClick={()=>selectTournament(t)} style={{background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:14,padding:"16px",textAlign:"left",position:"relative",overflow:"hidden"}}>
                  <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${SURFACE_COLOR[t.surface]}08 0%,transparent 60%)`,pointerEvents:"none"}}/>
                  <div style={{fontSize:24,marginBottom:6}}>{getFlag(t.country)}</div>
                  <div style={{fontSize:13,fontWeight:500,color:"var(--text)",marginBottom:2,fontFamily:"var(--serif)"}}>{t.city}</div>
                  <div style={{fontSize:10,color:"var(--text3)",marginBottom:6,fontWeight:300}}>{t.tournament_name}</div>
                  <div style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:999,color:SURFACE_COLOR[t.surface],background:`${SURFACE_COLOR[t.surface]}18`,border:`1px solid ${SURFACE_COLOR[t.surface]}33`,display:"inline-block"}}>{t.surface}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{padding:"0 16px"}}>
          {!citySearch&&<div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>All tournament cities</div>}
          {filteredCities.map((cityName,i)=>{
            const cts=tournamentsByCity[cityName]||[];
            const top=[...cts].sort((a,b)=>(CAT_RANK[a.category]||9)-(CAT_RANK[b.category]||9))[0];
            if(!top) return null;
            const isNear=detectedCity&&cityName.toLowerCase().includes(detectedCity.toLowerCase());
            const hasTips=!!(CITY_TIPS[cityName]);
            return (
              <button key={cityName} onClick={()=>selectTournament(top)} className="fu" style={{width:"100%",background:isNear?"rgba(0,208,132,0.05)":"var(--bg1)",border:`1px solid ${isNear?"rgba(0,208,132,0.2)":"var(--border)"}`,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:8,textAlign:"left",animationDelay:`${i*0.02}s`}}>
                <span style={{fontSize:26,flexShrink:0}}>{getFlag(top.country)}</span>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <span style={{fontSize:15,fontWeight:500,color:"var(--text)"}}>{cityName}</span>
                    {isNear&&<span style={{fontSize:9,color:"var(--green)",background:"rgba(0,208,132,0.1)",border:"1px solid rgba(0,208,132,0.2)",borderRadius:999,padding:"2px 7px",fontWeight:700}}>NEAR YOU</span>}
                    {hasTips&&<span style={{fontSize:9,color:"var(--text3)",background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:999,padding:"2px 7px"}}>guide ✓</span>}
                  </div>
                  <div style={{fontSize:11,color:"var(--text3)",fontWeight:300}}>{cts.length} tournament{cts.length>1?"s":""} · {top.country}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end"}}>
                  <div style={{fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:999,color:SURFACE_COLOR[top.surface],background:`${SURFACE_COLOR[top.surface]}18`,border:`1px solid ${SURFACE_COLOR[top.surface]}33`}}>{top.surface}</div>
                  <span style={{fontSize:9,color:"var(--text3)",fontWeight:300}}>{top.category}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // ── PROFILE TAB ────────────────────────────────────────────
  const ProfileTab=()=>{
    const myPosts=posts.filter(p=>p.author===player?.name);
    return (
      <div style={{padding:"0 0 120px"}}>
        <OkBox msg={ok}/>

        {/* Hero card */}
        <div style={{background:"var(--bg1)",borderBottom:"1px solid var(--border2)",padding:"28px 20px 24px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-60,right:-60,width:200,height:200,background:"radial-gradient(circle,var(--glow) 0%,transparent 65%)",pointerEvents:"none"}}/>

          <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:20}}>
            <div style={{position:"relative"}}>
              <Avatar src={player?.avatar_url} name={player?.name} size={68} glow={true} flag={getFlag(player?.country)}/>
              <button onClick={()=>{setProfileForm({name:player.name,country:player.country,ranking:player.ranking,tour:player.tour,surface_pref:player.surface_pref||"",pro_since:player.pro_since||"",bio:player.bio||"",achievements:player.achievements?.length?[...player.achievements,...Array(3).fill("")].slice(0,3):["","",""]});setEditProfile(true);}} style={{position:"absolute",bottom:-4,right:-4,width:24,height:24,background:"var(--green)",border:"2px solid var(--bg1)",borderRadius:"50%",color:"#000",fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>✎</button>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:22,fontWeight:400,fontFamily:"var(--serif)",marginBottom:4,lineHeight:1.2}}>{player?.name}</div>
              <div style={{fontSize:12,color:"var(--text2)",marginBottom:8,fontWeight:300}}>{player?.country} · {player?.tour}{player?.pro_since?` · Pro since ${player.pro_since}`:""}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                <div style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:999,color:"var(--green)",background:"rgba(0,208,132,0.1)",border:"1px solid rgba(0,208,132,0.2)"}}>Rank #{player?.ranking}</div>
                {player?.surface_pref&&<div style={{fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:999,color:SURFACE_COLOR[player.surface_pref],background:`${SURFACE_COLOR[player.surface_pref]}15`,border:`1px solid ${SURFACE_COLOR[player.surface_pref]}33`}}>{player.surface_pref}</div>}
              </div>
            </div>
          </div>

          {player?.current_tournament&&(
            <div style={{background:"rgba(167,139,250,0.08)",border:"1px solid rgba(167,139,250,0.2)",borderRadius:10,padding:"10px 14px",marginBottom:16,display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#a78bfa",animation:"pulse 2s infinite",flexShrink:0}}/>
              <span style={{fontSize:12,color:"#a78bfa",fontWeight:400}}>📍 {player.current_tournament}</span>
            </div>
          )}

          {player?.bio&&<div style={{fontSize:13,color:"var(--text2)",lineHeight:1.7,fontWeight:300,marginBottom:16}}>{player.bio}</div>}

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {[["Posts",myPosts.length],["Ranking",`#${player?.ranking}`]].map(([l,v])=>(
              <div key={l} style={{background:"var(--bg2)",borderRadius:12,padding:"12px",textAlign:"center",border:"1px solid var(--border2)"}}>
                <div style={{fontSize:20,fontWeight:600,color:"var(--green)",fontFamily:"var(--serif)"}}>{v}</div>
                <div style={{fontSize:9,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        {player?.achievements?.length>0&&(
          <div style={{padding:"20px 20px 0"}}>
            <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Career highlights</div>
            {player.achievements.map((a,i)=>a&&(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:10,marginBottom:6}}>
                <span>🏆</span>
                <span style={{fontSize:13,color:"var(--text)",fontWeight:300}}>{a}</span>
              </div>
            ))}
          </div>
        )}

        {/* My posts */}
        {myPosts.length>0&&(
          <div style={{padding:"20px 20px 0"}}>
            <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10,fontWeight:600}}>Your posts</div>
            {myPosts.slice(0,5).map(post=>{
              const cat=getCat(post.category);
              return (
                <div key={post.id} style={{background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:12,padding:"12px 14px",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <div style={{fontSize:9,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",padding:"2px 8px",borderRadius:999,color:cat.color,background:cat.bg,border:`1px solid ${cat.color}22`}}>{cat.icon} {cat.label}</div>
                    <span style={{fontSize:11,color:"var(--text3)",fontWeight:300}}>{ago(post.created_at)}</span>
                  </div>
                  <div style={{fontSize:13,lineHeight:1.6,color:"var(--text)",fontWeight:300}}>{post.content}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Invite */}
        <div style={{padding:"20px"}}>
          <div style={{background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:16,padding:20,marginBottom:12}}>
            <div style={{fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:14,fontWeight:600}}>Invite a fellow player</div>
            {!inviteLink?(
              <>
                <Inp type="email" placeholder="Player's email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}/>
                <GreenBtn onClick={genInvite} style={{padding:"11px 20px"}}>Generate invite link</GreenBtn>
              </>
            ):(
              <>
                <div style={{fontSize:12,color:"var(--green)",marginBottom:10}}>✓ Ready — copy and share</div>
                <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:10,padding:"10px 14px",fontSize:12,color:"var(--text2)",wordBreak:"break-all",lineHeight:1.6,fontWeight:300}}>{inviteLink}</div>
                <button onClick={()=>{setInviteLink("");setInviteEmail("");}} style={{background:"transparent",color:"var(--green)",fontSize:12,marginTop:10,fontWeight:600}}>Generate another</button>
              </>
            )}
          </div>
          <button onClick={logout} style={{width:"100%",background:"transparent",border:"1px solid var(--border)",color:"var(--text3)",borderRadius:12,padding:14,fontSize:13,fontWeight:300}}>Sign out</button>
        </div>
      </div>
    );
  };

  // ── ADMIN TAB ──────────────────────────────────────────────
  const AdminTab=()=>(
    <div style={{padding:"0 0 120px"}}>
      <div style={{padding:"20px 20px 12px",fontSize:11,color:"var(--text3)",letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600}}>Pending ({pending.length})</div>
      {pending.length===0&&<div style={{textAlign:"center",padding:"60px",color:"var(--text3)"}}><div style={{fontSize:32,marginBottom:12}}>✓</div><div style={{fontWeight:300}}>No pending applications</div></div>}
      {pending.map(p=>(
        <div key={p.id} style={{margin:"0 16px 12px",background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:16,padding:18}}>
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:18}}>{getFlag(p.country)}</span>
              <span style={{fontSize:15,fontWeight:500,fontFamily:"var(--serif)"}}>{p.name}</span>
            </div>
            <div style={{fontSize:12,color:"var(--text2)",fontWeight:300}}>Rank #{p.ranking} · {p.tour} · {p.country}</div>
            <div style={{fontSize:12,color:"var(--text3)",fontWeight:300}}>{p.email}</div>
            {p.invite_code&&<div style={{fontSize:11,color:"var(--green)",marginTop:4}}>Invite: {p.invite_code}</div>}
          </div>
          {p.credential_url&&(
            <a href={p.credential_url} target="_blank" rel="noopener noreferrer" style={{display:"block",marginBottom:14}}>
              <img src={p.credential_url} alt="" style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:10,border:"1px solid var(--border)"}}/>
              <div style={{fontSize:11,color:"var(--text3)",marginTop:4,fontWeight:300}}>↗ Tap to view full credential</div>
            </a>
          )}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>approve(p.id)} style={{flex:1,background:"var(--green)",color:"#000",border:"none",borderRadius:10,padding:12,fontSize:13,fontWeight:600}}>✓ Approve</button>
            <button onClick={()=>reject(p.id)} style={{flex:1,background:"transparent",color:"#ef4444",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,padding:12,fontSize:13}}>✗ Reject</button>
          </div>
        </div>
      ))}
    </div>
  );

  // ── MAIN RENDER ────────────────────────────────────────────
  return (
    <div style={{background:"var(--bg)",minHeight:"100vh",maxWidth:480,margin:"0 auto",position:"relative"}}>
      <style>{CSS}</style>
      {editProfile&&<ProfileEditModal/>}
      {likersModal&&<LikersModal/>}
      {viewingPlayer&&<PlayerProfileView p={viewingPlayer} onClose={()=>{setViewingPlayer(null);setViewingPlayerPosts([]);}}/>}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:"1px solid var(--border2)",background:"rgba(10,10,11,0.95)",position:"sticky",top:0,zIndex:30,backdropFilter:"blur(24px)"}}>
        <div style={{fontSize:13,letterSpacing:"0.14em",color:"var(--green)",fontWeight:600,textTransform:"uppercase",fontFamily:"var(--serif)"}}>PlayerCircle</div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>{getFlag(player?.country)}</span>
          <div style={{fontSize:10,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",padding:"4px 12px",borderRadius:999,color:"var(--green)",background:"rgba(0,208,132,0.1)",border:"1px solid rgba(0,208,132,0.2)"}}>#{player?.ranking} {player?.tour}</div>
        </div>
      </div>

      {tab==="feed"    &&<FeedTab/>}
      {tab==="cities"  &&<CitiesTab/>}
      {tab==="profile" &&<ProfileTab/>}
      {tab==="admin"   &&<AdminTab/>}

      <BottomNav/>
    </div>
  );
}
