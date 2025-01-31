export const getKeyGemini = () =>{
    const envString = process.env.GEMINI_API_KEY ?? '';
    console.log(envString);
    if(envString === '') return '';
    const env = JSON.parse(envString);
    const longitud = env.keys.length;
    var random = Math.floor(Math.random()*longitud);
    return env.keys[random];
}