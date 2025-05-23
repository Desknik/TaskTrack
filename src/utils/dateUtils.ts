/**
 * Formata uma string de data (YYYY-MM-DD) para o formato local
 * Evita problemas com fuso horário ao criar objetos Date
 */
export const formatLocalDate = (
  dateString: string, 
  options?: Intl.DateTimeFormatOptions
): string => {
  // Verifica se a data está no formato YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  
  // Criar a data usando componentes individuais (ano, mês, dia)
  // Mês é baseado em zero no JavaScript (janeiro = 0)
  const date = new Date(
    parseInt(parts[0]), 
    parseInt(parts[1]) - 1, 
    parseInt(parts[2])
  );
  
  return date.toLocaleDateString(undefined, options);
};

/**
 * Formata uma string de data para formato completo com dia da semana
 */
export const formatFullDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return formatLocalDate(dateString, options);
};

/**
 * Formata uma string de data para formato curto (mês abreviado)
 */
export const formatShortDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return formatLocalDate(dateString, options);
};
