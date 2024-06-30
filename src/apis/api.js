import axios from "axios";

const API = axios.create({
  baseURL: 'https://fake-api.avantstay.dev/graphql',
});

API.regions = {
  all: () => {
    let query = `{regions{id, name, stateName, stateCode}}`;
    return API.post('/', { query });
  }
};

API.homes = {
  /**
   * Get homes - pagination
   * @param {*} - params
   * 
   * region - {string} selected region id
   * period - {object} {checkIn: ISODate, checkout: ISODate}
   * guests - {int}
   * order - {string} RELEVANCE|PRICE_DESC|PRICE_ASC
   * page - {int} current page
   * pageSize - {int} count per page
   */
  get: ({ region, period, guests = 2, order = 'RELEVANCE', page = 1, pageSize = 10 }) => {
    let _period = `period: {checkIn: "${period?.checkIn}", checkOut: "${period?.checkOut}"},`;
    _period = period?.checkIn && period?.checkOut ? _period : ``;

    let query = `{
			homes(region: "${region}",${_period}guests: ${guests}, order: ${order}, page: ${page}, pageSize: ${pageSize})
				{
					count,
					results{
						id,
						title,
						description,
						photos{listOrder,url},
						roomsCount,
						bathroomsCount,
						bedsCount,
						maxOccupancy,
						hasPool,
						amenities,
						seasonPricing{highSeason{minPrice,maxPrice},lowSeason{minPrice,maxPrice}},
						regionName,
						cityName,
						stateName,
						stateCode
					}
				}
		}`;
    return API.post('/', { query });
  },

  /**
   * 
   * ids: [id]
   * period: { checkIn: ISODate!, checkOut: ISODate!}
   * coupon: String
   */
  getHomesPricing: ({ ids, period, coupon }) => {
    let _period = `period: {checkIn: "${period?.checkIn}", checkOut: "${period?.checkOut}"},`;
    _period = period?.checkIn && period?.checkOut ? _period : ``;

    let query = `{
			homesPricing(ids: ${JSON.stringify(ids)}, ${_period} ${coupon ? `coupon: "${coupon}"` : ''}) {
				homeId, numberOfNights, total
			}
		}`;
    return API.post('/', { query });
  }
};
export default API;
