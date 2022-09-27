export class apiService {
  _url = 'https://studika.ru/api/';

  async getData(route, method) {
    try {
      const result = await fetch(`${this._url}${route}`, {
        method
      })
      if (result.ok) {
        return await result.json();
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  getCities() {
    return this.getData('areas', 'POST')
  }
}