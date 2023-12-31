import { useHttps } from "../hooks/http.hooks";

const useMarvelService = () => {
  const _apiBase = "https://gateway.marvel.com:443/v1/public/";
  const _apiKey = "apikey=10c8c2894e082e4931cf447dcd5b9605";
  const _ts = "44";
  const _hash = "8f2b26565b67eae95cdf04a57d7982a8";
  const { loading, request, error, clearError } = useHttps();

  const getAllCharacters = async () => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=210&ts=${_ts}&${_apiKey}&hash=${_hash}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(
      `${_apiBase}characters/${id}?ts=${_ts}&${_apiKey}&hash=${_hash}`
    );
    return _transformCharacter(res.data.results[0]);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : "There is no description for this character",
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    };
  };

  const getAllComics = async () => {
    const res = await request(
      `${_apiBase}comics?limit=9&offset=210&ts=${_ts}&${_apiKey}&hash=${_hash}`
    );
    return res.data.results.map(_transformComics);
  };

  const getComic = async (id) => {
    const res = await request(
      `${_apiBase}comics/${id}?ts=${_ts}&${_apiKey}&hash=${_hash}`
    );
    return _transformComics(res.data.results[0]);
  };

  const _transformComics = (comics) => {
    return {
      id: comics.id,
      title: comics.title,
      description: comics.description || "There is no description",
      pageCount: comics.pageCount
        ? `${comics.pageCount} p.`
        : "No information about the number of pages",
      thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
      language: comics.textObjects[0]?.language || "en-us",
      price: comics.prices[0].price
        ? `${comics.prices[0].price}$`
        : "not available",
    };
  };

  return {
    loading,
    error,
    getAllCharacters,
    getCharacter,
    clearError,
    getAllComics,
    getComic,
  };
};

export default useMarvelService;
