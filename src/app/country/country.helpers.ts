import { CountryRelatedTerms } from "./country.data";
import { GeoFeature, GeoFeatureCollection } from "./country.model";

/*
    I have used this function to convert an array of key-value pairs
    containing a country name as key and country related terms as values
    into a key-value pair object with the same data.
    I don't know if I will probably use this code again but I put an entire morning
    and half a evening to make this work the way I needed so I don't want to lose it or
    forget it and then spend that amount of time writing it again
*/

export function convertArrayToRelatedTermsDict(
  geoJSON: GeoFeatureCollection,
  findCountryFlagFn: (feature: GeoFeature) => string
): CountryRelatedTerms {
  const newData: CountryRelatedTerms = {};
  geoJSON.features.forEach((currentFeature) => {
    newData[findCountryFlagFn(currentFeature)] = {
      adjectivals: [],
      demonyms: [],
    };
    Object.keys(countryRelatedTerms).some((countryName) => {
      const hasMatched = Object.entries(currentFeature.properties).some(([key, value]) => {
        //  Some countries have another country as it sovereignt. Others have the same name as a region.
        //  It's better to disregard that because it can get messy
        const rejectedKeys = ["SOVEREIGNT", "CONTINENT", "REGION_UN", "SUBREGION", "REGION_WB"];
        if (rejectedKeys.includes(key)) return false;
        return value === countryName;
      });
      if (hasMatched) {
        if (newData[findCountryFlagFn(currentFeature)]) {
          newData[findCountryFlagFn(currentFeature)].adjectivals.push(
            ...countryRelatedTerms[countryName].adjectivals
          );
          newData[findCountryFlagFn(currentFeature)].demonyms.push(
            ...countryRelatedTerms[countryName].demonyms
          );
        }
      }
      return hasMatched;
    });
  });
  return newData;
}

const countryRelatedTerms: CountryRelatedTerms = {
  Afghanistan: {
    adjectivals: ["Afghan"],
    demonyms: ["Afghans"],
  },
  Åland: {
    adjectivals: ["Åland Island"],
    demonyms: ["Ålanders"],
  },
  Albania: {
    adjectivals: ["Albanian"],
    demonyms: ["Albanians"],
  },
  Algeria: {
    adjectivals: ["Algerian"],
    demonyms: ["Algerians"],
  },
  "American Samoa": {
    adjectivals: ["American Samoan"],
    demonyms: ["American Samoans"],
  },
  Andorra: {
    adjectivals: ["Andorran"],
    demonyms: ["Andorrans"],
  },
  Angola: {
    adjectivals: ["Angolan"],
    demonyms: ["Angolans"],
  },
  Anguilla: {
    adjectivals: ["Anguillan"],
    demonyms: ["Anguillans"],
  },
  Antarctica: {
    adjectivals: ["Antarctic"],
    demonyms: ["Antarctic residents, Antarcticans"],
  },
  "Antigua and Barbuda": {
    adjectivals: ["Antiguan", "Barbudan"],
    demonyms: ["Antiguans", "Barbudans"],
  },
  Argentina: {
    adjectivals: ["Argentine", "Argentinian"],
    demonyms: ["Argentines", "Argentinians"],
  },
  Armenia: {
    adjectivals: ["Armenian"],
    demonyms: ["Armenians"],
  },
  Aruba: {
    adjectivals: ["Aruban"],
    demonyms: ["Arubans"],
  },
  //According to Google, Christmas Island and Cocos (Keeling) Islands are part of Australia.
  Australia: {
    adjectivals: ["Australian", "Christmas Island", "Cocos Island"],
    demonyms: ["Australians", "Christmas Islanders", "Cocos Islanders"],
  },
  Austria: {
    adjectivals: ["Austrian"],
    demonyms: ["Austrians"],
  },
  Azerbaijan: {
    adjectivals: ["Azerbaijani", "Azeri"],
    demonyms: ["Azerbaijanis", "Azeris"],
  },
  "The Bahamas": {
    adjectivals: ["Bahamian"],
    demonyms: ["Bahamians"],
  },
  Bahrain: {
    adjectivals: ["Bahraini"],
    demonyms: ["Bahrainis"],
  },
  Bangladesh: {
    adjectivals: ["Bangladeshi"],
    demonyms: ["Bangladeshis"],
  },
  Barbados: {
    adjectivals: ["Barbadian"],
    demonyms: ["Barbadians"],
  },
  Belarus: {
    adjectivals: ["Belarusian"],
    demonyms: ["Belarusians"],
  },
  Belgium: {
    adjectivals: ["Belgian"],
    demonyms: ["Belgians"],
  },
  Belize: {
    adjectivals: ["Belizean"],
    demonyms: ["Belizeans"],
  },
  Benin: {
    adjectivals: ["Beninese", "Beninois"],
    demonyms: ["Beninese", "Beninois"],
  },
  Bermuda: {
    adjectivals: ["Bermudian", "Bermudan"],
    demonyms: ["Bermudians", "Bermudans"],
  },
  Bhutan: {
    adjectivals: ["Bhutanese"],
    demonyms: ["Bhutanese"],
  },
  Bolivia: {
    adjectivals: ["Bolivian"],
    demonyms: ["Bolivians"],
  },

  "Bosnia and Herzegovina": {
    adjectivals: ["Bosnian", "Herzegovinian"],
    demonyms: ["Bosnians", "Herzegovinians"],
  },
  Botswana: {
    adjectivals: ["Botswana"],
    demonyms: ["Batswana (singular Motswana)"],
  },

  Brazil: {
    adjectivals: ["Brazilian"],
    demonyms: ["Brazilians"],
  },
  "British Indian Ocean Territory": {
    adjectivals: ["BIOT"],
    demonyms: ["British"],
  },
  Brunei: {
    adjectivals: ["Bruneian"],
    demonyms: ["Bruneians"],
  },
  Bulgaria: {
    adjectivals: ["Bulgarian"],
    demonyms: ["Bulgarians"],
  },
  "Burkina Faso": {
    adjectivals: ["Burkinabé"],
    demonyms: ["Burkinabè", "Burkinabé"],
  },
  Burundi: {
    adjectivals: ["Burundian"],
    demonyms: ["Burundians", "Barundi"],
  },
  "Cabo Verde": {
    adjectivals: ["Cabo Verdean"],
    demonyms: ["Cabo Verdeans"],
  },
  Cambodia: {
    adjectivals: ["Cambodian"],
    demonyms: ["Cambodians"],
  },
  Cameroon: {
    adjectivals: ["Cameroonian"],
    demonyms: ["Cameroonians"],
  },
  Canada: {
    adjectivals: ["Canadian"],
    demonyms: ["Canadians"],
  },
  "Cayman Islands": {
    adjectivals: ["Caymanian"],
    demonyms: ["Caymanians"],
  },
  "Central African Republic": {
    adjectivals: ["Central African"],
    demonyms: ["Central Africans"],
  },
  Chad: {
    adjectivals: ["Chadian"],
    demonyms: ["Chadians"],
  },
  Chile: {
    adjectivals: ["Chilean"],
    demonyms: ["Chileans"],
  },
  China: {
    adjectivals: ["Chinese"],
    demonyms: ["Chinese"],
  },
  Colombia: {
    adjectivals: ["Colombian"],
    demonyms: ["Colombians"],
  },
  Comoros: {
    adjectivals: ["Comoran", "Comorian"],
    demonyms: ["Comorans", "Comorians"],
  },
  "Democratic Republic of the Congo": {
    adjectivals: ["Congolese"],
    demonyms: ["Congolese"],
  },
  "Republic of the Congo": {
    adjectivals: ["Congolese"],
    demonyms: ["Congolese"],
  },
  "Cook Islands": {
    adjectivals: ["Cook Island"],
    demonyms: ["Cook Islanders"],
  },
  "Costa Rica": {
    adjectivals: ["Costa Rican"],
    demonyms: ["Costa Ricans"],
  },
  Croatia: {
    adjectivals: ["Croatian"],
    demonyms: ["Croatians", "Croats"],
  },
  Cuba: {
    adjectivals: ["Cuban"],
    demonyms: ["Cubans"],
  },
  Curaçao: {
    adjectivals: ["Curaçaoan"],
    demonyms: ["Curaçaoans"],
  },
  Cyprus: {
    adjectivals: ["Cypriot"],
    demonyms: ["Cypriots"],
  },
  "Czech Republic": {
    adjectivals: ["Czech"],
    demonyms: ["Czechs"],
  },
  Denmark: {
    adjectivals: ["Danish"],
    demonyms: ["Danes"],
  },
  Djibouti: {
    adjectivals: ["Djiboutian"],
    demonyms: ["Djiboutians"],
  },
  Dominica: {
    adjectivals: ["Dominican"],
    demonyms: ["Dominicans"],
  },
  "Dominican Republic": {
    adjectivals: ["Dominican"],
    demonyms: ["Dominicans"],
  },
  "East Timor": {
    adjectivals: ["Timorese"],
    demonyms: ["Timorese"],
  },
  Ecuador: {
    adjectivals: ["Ecuadorian"],
    demonyms: ["Ecuadorians"],
  },
  Egypt: {
    adjectivals: ["Egyptian"],
    demonyms: ["Egyptians"],
  },
  "El Salvador": {
    adjectivals: ["Salvadoran"],
    demonyms: ["Salvadorans", "Salvadorians", "Salvadoreans"],
  },

  "Equatorial Guinea": {
    adjectivals: ["Equatorial Guinean", "Equatoguinean"],
    demonyms: ["Equatorial Guineans", "Equatoguineans"],
  },
  Eritrea: {
    adjectivals: ["Eritrean"],
    demonyms: ["Eritreans"],
  },
  Estonia: {
    adjectivals: ["Estonian"],
    demonyms: ["Estonians"],
  },
  Eswatini: {
    adjectivals: ["Swazi", "Swati"],
    demonyms: ["Swazis"],
  },
  Ethiopia: {
    adjectivals: ["Ethiopian"],
    demonyms: ["Ethiopians", "Habesha"],
  },
  "Falkland Islands": {
    adjectivals: ["Falkland Island"],
    demonyms: ["Falkland Islanders"],
  },
  "Faroe Islands": {
    adjectivals: ["Faroese"],
    demonyms: ["Faroese"],
  },
  Fiji: {
    adjectivals: ["Fijian"],
    demonyms: ["Fijians"],
  },
  Finland: {
    adjectivals: ["Finnish"],
    demonyms: ["Finns"],
  },
  //According to Google, Guadeloupe, Martinique, Mayotte and Réunion is part of France.
  France: {
    adjectivals: [
      "French",
      "French Guianese",
      "French Southern Territories",
      "Guadeloupe",
      "Martiniquais",
      "Martinican",
      "Mahoran",
      "Réunionese",
      "Réunionnais",
    ],
    demonyms: [
      "French",
      "Frenchmen and Frenchwomen",
      "French Guianese",
      "Guadeloupians",
      "Guadeloupeans",
      "Martiniquais",
      "Martiniquaises",
      "Mahorans",
      "Réunionese",
      "Réunionnais and Réunionnaises",
    ],
  },
  "French Polynesia": {
    adjectivals: ["French Polynesian"],
    demonyms: ["French Polynesians"],
  },
  Gabon: {
    adjectivals: ["Gabonese"],
    demonyms: ["Gabonese", "Gabonaise"],
  },
  "The Gambia": {
    adjectivals: ["Gambian"],
    demonyms: ["Gambians"],
  },
  Georgia: {
    adjectivals: ["Georgian"],
    demonyms: ["Georgians"],
  },
  Germany: {
    adjectivals: ["German"],
    demonyms: ["Germans"],
  },
  Ghana: {
    adjectivals: ["Ghanaian"],
    demonyms: ["Ghanaians"],
  },

  Greece: {
    adjectivals: ["Greek", "Hellenic"],
    demonyms: ["Greeks", "Hellenes"],
  },
  Greenland: {
    adjectivals: ["Greenland"],
    demonyms: ["Greenlanders"],
  },
  Grenada: {
    adjectivals: ["Grenadian"],
    demonyms: ["Grenadians"],
  },

  Guam: {
    adjectivals: ["Guamanian"],
    demonyms: ["Guamanians"],
  },
  Guatemala: {
    adjectivals: ["Guatemalan"],
    demonyms: ["Guatemalans"],
  },
  Guernsey: {
    adjectivals: ["Guernsey"],
    demonyms: ["Guernseymen and Guernseywomen"],
  },
  Guinea: {
    adjectivals: ["Guinean"],
    demonyms: ["Guineans"],
  },
  "Guinea-Bissau": {
    adjectivals: ["Bissau-Guinean"],
    demonyms: ["Bissau-Guineans"],
  },
  Guyana: {
    adjectivals: ["Guyanese"],
    demonyms: ["Guyanese"],
  },
  Haiti: {
    adjectivals: ["Haitian"],
    demonyms: ["Haitians"],
  },
  "Heard Island and McDonald Islands": {
    adjectivals: ["Heard Island", "McDonald Island"],
    demonyms: ["Heard Islanders", "McDonald Islanders"],
  },
  Honduras: {
    adjectivals: ["Honduran"],
    demonyms: ["Hondurans"],
  },
  "Hong Kong": {
    adjectivals: ["Hong Kong", "Cantonese", "Hong Konger"],
    demonyms: ["Hongkongers", "Hong Kongese"],
  },
  Hungary: {
    adjectivals: ["Hungarian", "Magyar"],
    demonyms: ["Hungarians", "Magyars"],
  },
  Iceland: {
    adjectivals: ["Icelandic"],
    demonyms: ["Icelanders"],
  },
  India: {
    adjectivals: ["Indian"],
    demonyms: ["Indians"],
  },
  Indonesia: {
    adjectivals: ["Indonesian"],
    demonyms: ["Indonesians"],
  },
  Iran: {
    adjectivals: ["Iranian", "Persian"],
    demonyms: ["Iranians", "Persians"],
  },
  Iraq: {
    adjectivals: ["Iraqi"],
    demonyms: ["Iraqis"],
  },
  Ireland: {
    adjectivals: ["Irish"],
    demonyms: ["Irish", "Irishmen and Irishwomen"],
  },
  "Isle of Man": {
    adjectivals: ["Manx"],
    demonyms: ["Manx", "Manxmen and Manxwomen"],
  },
  Israel: {
    adjectivals: ["Israeli", "Israelite"],
    demonyms: ["Israelis"],
  },
  Italy: {
    adjectivals: ["Italian"],
    demonyms: ["Italians"],
  },
  "Ivory Coast": {
    adjectivals: ["Ivorian"],
    demonyms: ["Ivorians"],
  },
  Jamaica: {
    adjectivals: ["Jamaican"],
    demonyms: ["Jamaicans"],
  },

  Japan: {
    adjectivals: ["Japanese"],
    demonyms: ["Japanese"],
  },
  Jersey: {
    adjectivals: ["Jersey"],
    demonyms: ["Jerseymen and Jerseywomen", "Jersian", "Jèrriais"],
  },
  Jordan: {
    adjectivals: ["Jordanian"],
    demonyms: ["Jordanians"],
  },
  Kazakhstan: {
    adjectivals: ["Kazakhstani", "Kazakh"],
    demonyms: ["Kazakhstanis", "Kazakhs"],
  },
  Kenya: {
    adjectivals: ["Kenyan"],
    demonyms: ["Kenyans"],
  },
  Kiribati: {
    adjectivals: ["Kiribati"],
    demonyms: ["I-Kiribati"],
  },
  "North Korea": {
    adjectivals: ["North Korean"],
    demonyms: ["Koreans", "North Koreans"],
  },
  "South Korea": {
    adjectivals: ["South Korean"],
    demonyms: ["Koreans", "South Koreans"],
  },
  Kosovo: {
    adjectivals: ["Kosovar", "Kosovan"],
    demonyms: ["Kosovars"],
  },
  Kuwait: {
    adjectivals: ["Kuwaiti"],
    demonyms: ["Kuwaitis"],
  },
  Kyrgyzstan: {
    adjectivals: ["Kyrgyzstani", "Kyrgyz", "Kirgiz", "Kirghiz"],
    demonyms: ["Kyrgyzstanis", "Kyrgyz", "Kirgiz", "Kirghiz"],
  },
  Laos: {
    adjectivals: ["Lao", "Laotian"],
    demonyms: ["Laos", "Laotians"],
  },
  Latvia: {
    adjectivals: ["Latvian", "Lettish"],
    demonyms: ["Latvians", "Letts"],
  },
  Lebanon: {
    adjectivals: ["Lebanese"],
    demonyms: ["Lebanese"],
  },
  Lesotho: {
    adjectivals: ["Basotho"],
    demonyms: ["Basotho (singular Mosotho)"],
  },
  Liberia: {
    adjectivals: ["Liberian"],
    demonyms: ["Liberians"],
  },
  Libya: {
    adjectivals: ["Libyan"],
    demonyms: ["Libyans"],
  },
  Liechtenstein: {
    adjectivals: ["Liechtensteiner"],
    demonyms: ["Liechtensteiners"],
  },
  Lithuania: {
    adjectivals: ["Lithuanian"],
    demonyms: ["Lithuanians"],
  },
  Luxembourg: {
    adjectivals: ["Luxembourg", "Luxembourgish"],
    demonyms: ["Luxembourgers"],
  },
  Macau: {
    adjectivals: ["Macanese"],
    demonyms: ["Macanese"],
  },
  Madagascar: {
    adjectivals: ["Malagasy, Madagascan"],
    demonyms: ["Malagasy, Madagascans"],
  },
  Malawi: {
    adjectivals: ["Malawian"],
    demonyms: ["Malawians"],
  },
  Malaysia: {
    adjectivals: ["Malaysian"],
    demonyms: ["Malaysians"],
  },
  Maldives: {
    adjectivals: ["Maldivian"],
    demonyms: ["Maldivians"],
  },
  Mali: {
    adjectivals: ["Malian", "Malinese"],
    demonyms: ["Malians"],
  },
  Malta: {
    adjectivals: ["Maltese"],
    demonyms: ["Maltese"],
  },
  "Marshall Islands": {
    adjectivals: ["Marshallese"],
    demonyms: ["Marshallese"],
  },

  Mauritania: {
    adjectivals: ["Mauritanian"],
    demonyms: ["Mauritanians"],
  },
  Mauritius: {
    adjectivals: ["Mauritian"],
    demonyms: ["Mauritians"],
  },

  Mexico: {
    adjectivals: ["Mexican"],
    demonyms: ["Mexicans"],
  },
  Micronesia: {
    adjectivals: ["Micronesian"],
    demonyms: ["Micronesians"],
  },
  Moldova: {
    adjectivals: ["Moldovan"],
    demonyms: ["Moldovans"],
  },
  Monaco: {
    adjectivals: ["Monégasque", "Monacan"],
    demonyms: ["Monégasques", "Monacans"],
  },
  Mongolia: {
    adjectivals: ["Mongolian"],
    demonyms: ["Mongolians", "Mongols"],
  },
  Montenegro: {
    adjectivals: ["Montenegrin"],
    demonyms: ["Montenegrins"],
  },
  Montserrat: {
    adjectivals: ["Montserratian"],
    demonyms: ["Montserratians"],
  },
  Morocco: {
    adjectivals: ["Moroccan"],
    demonyms: ["Moroccans"],
  },
  Mozambique: {
    adjectivals: ["Mozambican"],
    demonyms: ["Mozambicans"],
  },
  Myanmar: {
    adjectivals: ["Myanma", "Burmese"],
    demonyms: ["Myanmar"],
  },
  Namibia: {
    adjectivals: ["Namibian"],
    demonyms: ["Namibians"],
  },
  Nauru: {
    adjectivals: ["Nauruan"],
    demonyms: ["Nauruans"],
  },
  Nepal: {
    adjectivals: ["Nepali", "Nepalese"],
    demonyms: ["Nepalis", "Nepalese"],
  },
  //According to Google, Bonaire, Saba and Sint Eustatius are part of Netherlands.
  Netherlands: {
    adjectivals: ["Dutch", "Bonaire", "Bonairean", "Saban", "Sint Eustatius", "Statian"],
    demonyms: [
      "Dutch",
      "Dutchmen and Dutchwomen",
      "Netherlanders",
      "Bonaire Dutch",
      "Saba Dutch",
      "Statians",
    ],
  },
  "New Caledonia": {
    adjectivals: ["New Caledonian"],
    demonyms: ["New Caledonians"],
  },
  //According to Google, Tokelau is part of New Zealand.
  "New Zealand": {
    adjectivals: ["New Zealand", "Tokelauan"],
    demonyms: ["New Zealanders", "Tokelauans"],
  },
  Nicaragua: {
    adjectivals: ["Nicaraguan"],
    demonyms: ["Nicaraguans"],
  },
  Niger: {
    adjectivals: ["Nigerien"],
    demonyms: ["Nigeriens"],
  },
  Nigeria: {
    adjectivals: ["Nigerian"],
    demonyms: ["Nigerians"],
  },
  Niue: {
    adjectivals: ["Niuean"],
    demonyms: ["Niueans"],
  },
  "Norfolk Island": {
    adjectivals: ["Norfolk Island"],
    demonyms: ["Norfolk Islanders"],
  },
  "North Macedonia": {
    adjectivals: ["Macedonian"],
    demonyms: ["Macedonians"],
  },

  "Northern Mariana Islands": {
    adjectivals: ["Northern Marianan"],
    demonyms: ["Northern Marianans"],
  },
  //Acording to Google, Bouvet Island, Jan Mayen and Svalbard are part of Norway.
  //It's highy unlikely that an artist will come from there but who knows.
  Norway: {
    adjectivals: ["Norwegian", "Bouvet Island", "Jan Mayen", "Svalbard"],
    demonyms: ["Norwegians", "Bouvet Islanders", "Jan Mayen residents", "Svalbard residents"],
  },
  Oman: {
    adjectivals: ["Omani"],
    demonyms: ["Omanis"],
  },
  Pakistan: {
    adjectivals: ["Pakistani"],
    demonyms: ["Pakistanis"],
  },
  Palau: {
    adjectivals: ["Palauan"],
    demonyms: ["Palauans"],
  },
  Palestine: {
    adjectivals: ["Palestinian"],
    demonyms: ["Palestinians"],
  },
  Panama: {
    adjectivals: ["Panamanian"],
    demonyms: ["Panamanians"],
  },
  "Papua New Guinea": {
    adjectivals: ["Papua New Guinean", "Papuan"],
    demonyms: ["Papua New Guineans", "Papuans"],
  },
  Paraguay: {
    adjectivals: ["Paraguayan"],
    demonyms: ["Paraguayans"],
  },
  Peru: {
    adjectivals: ["Peruvian"],
    demonyms: ["Peruvians"],
  },
  Philippines: {
    adjectivals: ["Filipino", "Philippine"],
    demonyms: ["Filipinos", "Filipinas"],
  },
  "Pitcairn Islands": {
    adjectivals: ["Pitcairn Island"],
    demonyms: ["Pitcairn Islanders"],
  },
  Poland: {
    adjectivals: ["Polish"],
    demonyms: ["Poles"],
  },
  Portugal: {
    adjectivals: ["Portuguese"],
    demonyms: ["Portuguese"],
  },
  "Puerto Rico": {
    adjectivals: ["Puerto Rican"],
    demonyms: ["Puerto Ricans"],
  },
  Qatar: {
    adjectivals: ["Qatari"],
    demonyms: ["Qataris"],
  },

  Romania: {
    adjectivals: ["Romanian"],
    demonyms: ["Romanians"],
  },
  Russia: {
    adjectivals: ["Russian"],
    demonyms: ["Russians"],
  },
  Rwanda: {
    adjectivals: ["Rwandan"],
    demonyms: ["Rwandans", "Banyarwanda"],
  },

  "Saint Barthélemy": {
    adjectivals: ["Barthélemois"],
    demonyms: ["Barthélemois", "Barthélemoises"],
  },
  "Saint Helena, Ascension, and Tristan da Cunha": {
    adjectivals: ["Saint Helenian"],
    demonyms: ["Saint Helenians"],
  },
  "Saint Kitts and Nevis": {
    adjectivals: ["Kittitian", "Nevisian"],
    demonyms: ["Kittitians", "Nevisians"],
  },
  "Saint Lucia": {
    adjectivals: ["Saint Lucian"],
    demonyms: ["Saint Lucians"],
  },
  "Saint Martin": {
    adjectivals: ["Saint-Martinoise"],
    demonyms: ["Saint-Martinois", "Saint-Martinoises"],
  },
  "Saint Pierre and Miquelon": {
    adjectivals: ["Saint-Pierrais", "Miquelonnais"],
    demonyms: ["Saint-Pierrais", "Saint-Pierraises", "Miquelonnais", "Miquelonnaises"],
  },
  "Saint Vincent and the Grenadines": {
    adjectivals: ["Saint Vincentian", "Vincentian"],
    demonyms: ["Saint Vincentians", "Vincentians"],
  },

  Samoa: {
    adjectivals: ["Samoan"],
    demonyms: ["Samoans"],
  },
  "San Marino": {
    adjectivals: ["Sammarinese"],
    demonyms: ["Sammarinese"],
  },
  "São Tomé and Príncipe": {
    adjectivals: ["São Toméan"],
    demonyms: ["São Toméans"],
  },
  "Saudi Arabia": {
    adjectivals: ["Saudi", "Saudi Arabian"],
    demonyms: ["Saudis", "Saudi Arabians"],
  },

  Senegal: {
    adjectivals: ["Senegalese"],
    demonyms: ["Senegalese"],
  },
  Serbia: {
    adjectivals: ["Serbian"],
    demonyms: ["Serbs", "Serbians"],
  },
  Seychelles: {
    adjectivals: ["Seychellois"],
    demonyms: ["Seychellois/Seychelloises"],
  },
  "Sierra Leone": {
    adjectivals: ["Sierra Leonean"],
    demonyms: ["Sierra Leoneans"],
  },
  Singapore: {
    adjectivals: ["Singapore", "Singaporean"],
    demonyms: ["Singaporeans"],
  },

  "Sint Maarten": {
    adjectivals: ["Sint Maarten"],
    demonyms: ["Sint Maarteners"],
  },
  Slovakia: {
    adjectivals: ["Slovak"],
    demonyms: ["Slovaks", "Slovakians"],
  },
  Slovenia: {
    adjectivals: ["Slovenian", "Slovene"],
    demonyms: ["Slovenes", "Slovenians"],
  },
  "Solomon Islands": {
    adjectivals: ["Solomon Island"],
    demonyms: ["Solomon Islanders"],
  },
  Somalia: {
    adjectivals: ["Somali"],
    demonyms: ["Somalis"],
  },
  Somaliland: {
    adjectivals: ["Somalilander"],
    demonyms: ["Somalilanders"],
  },
  "South Africa": {
    adjectivals: ["South African"],
    demonyms: ["South Africans"],
  },
  "South Georgia and the South Sandwich Islands": {
    adjectivals: ["South Georgia Island", "South Sandwich Island"],
    demonyms: ["South Georgia Islanders", "South Sandwich Islanders"],
  },
  "South Sudan": {
    adjectivals: ["South Sudanese"],
    demonyms: ["South Sudanese"],
  },
  Spain: {
    adjectivals: ["Spanish"],
    demonyms: ["Spaniards"],
  },
  "Sri Lanka": {
    adjectivals: ["Sri Lankan"],
    demonyms: ["Sri Lankans"],
  },
  Sudan: {
    adjectivals: ["Sudanese"],
    demonyms: ["Sudanese"],
  },
  Suriname: {
    adjectivals: ["Surinamese"],
    demonyms: ["Surinamers"],
  },

  Sweden: {
    adjectivals: ["Swedish"],
    demonyms: ["Swedes"],
  },
  Switzerland: {
    adjectivals: ["Swiss"],
    demonyms: ["Swiss"],
  },
  Syria: {
    adjectivals: ["Syrian"],
    demonyms: ["Syrians"],
  },
  Taiwan: {
    adjectivals: ["Taiwanese", "Formosan"],
    demonyms: ["Taiwanese", "Formosans"],
  },
  Tajikistan: {
    adjectivals: ["Tajikistani"],
    demonyms: ["Tajikistanis", "Tajiks"],
  },
  //According to Google, Zanzibar is part of Tanzania.
  Tanzania: {
    adjectivals: ["Tanzanian", "Zanzibari"],
    demonyms: ["Tanzanians", "Zanzibaris"],
  },
  Thailand: {
    adjectivals: ["Thai"],
    demonyms: ["Thai"],
  },
  "Timor-Leste": {
    adjectivals: ["Timorese"],
    demonyms: ["Timorese"],
  },
  Togo: {
    adjectivals: ["Togolese"],
    demonyms: ["Togolese"],
  },

  Tonga: {
    adjectivals: ["Tongan"],
    demonyms: ["Tongans"],
  },
  "Trinidad and Tobago": {
    adjectivals: ["Trinidadian", "Tobagonian"],
    demonyms: ["Trinidadians", "Tobagonians"],
  },
  Tunisia: {
    adjectivals: ["Tunisian"],
    demonyms: ["Tunisians"],
  },
  Turkey: {
    adjectivals: ["Turkish"],
    demonyms: ["Turks"],
  },
  Turkmenistan: {
    adjectivals: ["Turkmen"],
    demonyms: ["Turkmens"],
  },
  "Turks and Caicos Islands": {
    adjectivals: ["Turks and Caicos Island"],
    demonyms: ["Turks and Caicos Islanders"],
  },
  Tuvalu: {
    adjectivals: ["Tuvaluan"],
    demonyms: ["Tuvaluans"],
  },
  Uganda: {
    adjectivals: ["Ugandan"],
    demonyms: ["Ugandans"],
  },
  Ukraine: {
    adjectivals: ["Ukrainian"],
    demonyms: ["Ukrainians"],
  },
  "United Arab Emirates": {
    adjectivals: ["Emirati", "Emirian", "Emiri"],
    demonyms: ["Emiratis", "Emirians", "Emiri"],
  },
  //According to Google, Gibraltar is part of UK.
  "United Kingdom of Great Britain and Northern Ireland": {
    adjectivals: [
      "British",
      "United Kingdom",
      "UK",
      "English",
      "Gibraltar",
      "Northern Irish",
      "Scotland",
      "Scottish",
      "Wales",
      "Welsh",
    ],
    demonyms: [
      "Britons",
      "British people",
      "English",
      "Englishmen and Englishwomen",
      "Gibraltarians",
      "Northern Irish",
      "Northern Irishmen and Northern Irishwomen",
      "Scots",
      "Scotsmen and Scotswomen",
      "Welshmen",
      "Welshwomen",
    ],
  },
  "United States of America": {
    adjectivals: ["American", "United States", "U.S."],
    demonyms: ["Americans"],
  },
  Uruguay: {
    adjectivals: ["Uruguayan"],
    demonyms: ["Uruguayans"],
  },
  Uzbekistan: {
    adjectivals: ["Uzbekistani", "Uzbek"],
    demonyms: ["Uzbekistanis", "Uzbeks"],
  },
  Vanuatu: {
    adjectivals: ["Ni-Vanuatu", "Vanuatuan"],
    demonyms: ["Ni-Vanuatu"],
  },
  "Vatican City": {
    adjectivals: ["Vaticanian"],
    demonyms: ["Vaticanians"],
  },
  Venezuela: {
    adjectivals: ["Venezuelan"],
    demonyms: ["Venezuelans"],
  },
  Vietnam: {
    adjectivals: ["Vietnamese"],
    demonyms: ["Vietnamese"],
  },
  "British Virgin Islands": {
    adjectivals: ["British Virgin Island"],
    demonyms: ["British Virgin Islanders"],
  },
  "United States Virgin Islands": {
    adjectivals: ["U.S. Virgin Island"],
    demonyms: ["U.S. Virgin Islanders"],
  },

  "Wallis and Futuna": {
    adjectivals: ["Wallis and Futuna", "Wallisian", "Futunan"],
    demonyms: ["Wallis and Futuna Islanders", "Wallisians", "Futunans"],
  },
  "Western Sahara": {
    adjectivals: ["Sahrawi", "Sahrawian", "Sahraouian", "Sahrawi", "Western Saharan", "Sahrawian"],
    demonyms: ["Sahrawis", "Sahraouis", "Sahrawis", "Western Saharans"],
  },
  Yemen: {
    adjectivals: ["Yemeni"],
    demonyms: ["Yemenis"],
  },
  Zambia: {
    adjectivals: ["Zambian"],
    demonyms: ["Zambians"],
  },

  Zimbabwe: {
    adjectivals: ["Zimbabwean"],
    demonyms: ["Zimbabweans"],
  },
};

// countriesJSON.objects.countries.geometries.forEach((geometry) => {
//   Object.keys(geometry.properties).forEach((key) => {
//     if (
//       ![
//         "NAME",
//         "ISO_A2",
//         "ISO_A2_EH",
//         "UN_A3",
//         "POSTAL",
//         "FIPS_10",
//         "REGION_UN",
//         "SUBREGION",
//         "REGION_WB",
//         "NE_ID",
//       ].includes(key)
//     )
//       delete (geometry.properties as any)[key as any];
//   });
// });
// console.log(JSON.stringify(countriesJSON));
