export const apiEnvKey = 'API_URL'

export function environment(arg: string): string{
  if(arg == apiEnvKey){
    return 'http://localhost:5141';
  }

  return '';
}