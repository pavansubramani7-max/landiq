import datetime

# Bangalore locality growth rates (annual, 2024 estimates)
LOCALITY_GROWTH = {
    # Premium — steady appreciation
    'MG Road': 0.08,        'Brigade Road': 0.08,   'Lavelle Road': 0.09,
    'Koramangala': 0.11,    'Indiranagar': 0.11,    'Sadashivanagar': 0.09,
    'Jayanagar': 0.10,      'Malleshwaram': 0.10,   'Basavanagudi': 0.09,
    'Vasanth Nagar': 0.09,  'Richmond Town': 0.09,  'Frazer Town': 0.10,

    # IT Corridor — high growth
    'Whitefield': 0.14,     'Marathahalli': 0.13,   'ITPL': 0.14,
    'Brookefield': 0.13,    'Hoodi': 0.13,          'Mahadevapura': 0.13,
    'Sarjapur Road': 0.15,  'Bellandur': 0.13,      'HSR Layout': 0.12,
    'BTM Layout': 0.11,     'JP Nagar': 0.11,       'Banashankari': 0.10,
    'Electronic City': 0.12,'Bommanahalli': 0.11,   'Harlur': 0.13,

    # North — airport corridor boom
    'Hebbal': 0.14,         'Yelahanka': 0.13,      'Devanahalli': 0.16,
    'Thanisandra': 0.13,    'Jakkur': 0.12,         'Kogilu': 0.12,
    'Nagawara': 0.12,       'HBR Layout': 0.11,     'Kalyan Nagar': 0.11,
    'Bellary Road': 0.13,

    # West
    'Rajajinagar': 0.10,    'Yeshwanthpur': 0.11,   'Peenya': 0.08,
    'Nagarbhavi': 0.10,     'Vijayanagar': 0.10,    'RR Nagar': 0.10,
    'Mahalakshmi Layout': 0.10,

    # East
    'KR Puram': 0.12,       'Varthur': 0.11,        'Kadugodi': 0.11,
    'Doddanekundi': 0.12,

    # Peripheral — emerging
    'Kanakapura Road': 0.13,'Bannerghatta Road': 0.12,
    'Carmelaram': 0.12,     'Begur': 0.11,          'Chandapura': 0.10,
    'Hoskote': 0.10,        'Anekal': 0.09,         'Attibele': 0.08,
    'Doddaballapur': 0.09,
}

ZONE_MODIFIER = {
    'commercial': 1.12, 'industrial': 1.05,
    'residential': 1.0, 'agricultural': 0.88
}

INFRA_MODIFIER = {
    'excellent': 1.08, 'good': 1.04, 'average': 1.0, 'poor': 0.95
}


def forecast_prices(data):
    locality  = data.get('locality', data.get('city', 'Whitefield'))
    zone      = data.get('zone', data.get('land_type', 'residential'))
    infra     = data.get('infrastructure', 'good')
    asking    = float(data.get('asking_price', 0))
    area      = float(data.get('area_sqft', 1))
    current_sqft = asking / area if area > 0 else 0

    base_rate = LOCALITY_GROWTH.get(locality, 0.11)
    rate = base_rate * ZONE_MODIFIER.get(zone, 1.0) * INFRA_MODIFIER.get(infra, 1.0)

    base_year = datetime.datetime.now().year
    series = []
    for yr in range(6):
        price_sqft = current_sqft * ((1 + rate) ** yr)
        series.append({
            'year': base_year + yr,
            'price_sqft': round(price_sqft, 2),
            'total_value': round(price_sqft * area, 2)
        })

    five_yr_gain = (
        round(((series[5]['total_value'] / series[0]['total_value']) - 1) * 100, 1)
        if series[0]['total_value'] > 0 else 0
    )

    return {
        'locality': locality,
        'annual_growth_rate_pct': round(rate * 100, 2),
        'locality_base_rate_pct': round(base_rate * 100, 2),
        'series': series,
        'five_year_gain_pct': five_yr_gain
    }
