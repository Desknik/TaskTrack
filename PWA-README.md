# PWA (Progressive Web App) - TaskTrack

## Funcionalidades PWA Implementadas

### 🔧 Configurações Básicas
- ✅ Service Worker automático via Vite PWA Plugin
- ✅ Manifest.json configurado
- ✅ Ícones PWA (192x192 e 512x512)
- ✅ Meta tags apropriadas
- ✅ Tema color configurado

### 📱 Instalação
- ✅ Detecção automática da capacidade de instalação
- ✅ Banner de instalação personalizado
- ✅ Shortcuts no manifest para ações rápidas
- ✅ Suporte a diferentes dispositivos e navegadores

### 🔔 Notificações
- ✅ Solicitação de permissão de notificações
- ✅ Notificações de atualização disponível
- ✅ Notificações de status offline/online
- ✅ Notificações personalizadas para eventos do app

### 📵 Funcionalidade Offline
- ✅ Cache automático de recursos estáticos
- ✅ Armazenamento local de dados
- ✅ Fila de sincronização para ações offline
- ✅ Indicador de status de conectividade
- ✅ Sincronização automática ao voltar online

### ⚙️ Configurações PWA
- ✅ Painel de configurações PWA na página de configurações
- ✅ Status do modo PWA, conectividade e notificações
- ✅ Controles de sincronização manual
- ✅ Limpeza de dados offline

## Como Usar

### Instalação do App
1. Abra o TaskTrack no navegador
2. Um banner aparecerá automaticamente oferecendo instalação
3. Clique em "Instalar" ou acesse Configurações > PWA > Instalar App
4. O app será instalado como um aplicativo nativo

### Uso Offline
1. O app funciona automaticamente offline após a primeira visita
2. Dados são salvos localmente e sincronizados quando online
3. Ações realizadas offline são enfileiradas para sincronização
4. Monitor de conectividade indica o status atual

### Notificações
1. Acesse Configurações > PWA > Notificações
2. Clique em "Permitir" para ativar notificações
3. Teste as notificações com o botão "Testar"
4. Receba notificações sobre atualizações e eventos importantes

## Estrutura de Arquivos PWA

```
src/
├── components/
│   ├── PWABanner.tsx          # Banner de instalação
│   └── PWASettings.tsx        # Painel de configurações PWA
├── hooks/
│   └── usePWA.ts             # Hook para funcionalidades PWA
├── utils/
│   ├── pwaUtils.ts           # Utilitários PWA gerais
│   └── offlineManager.ts     # Gerenciamento de dados offline
public/
├── pwa-192x192.png           # Ícone PWA 192x192
└── pwa-512x512.png           # Ícone PWA 512x512
```

## Scripts NPM

```bash
# Build com otimizações PWA
npm run build:pwa

# Preview do build com servidor local
npm run preview:pwa

# Gerar novos ícones PWA
npm run generate-icons
```

## Configurações Avançadas

### Manifest.json
O manifest é gerado automaticamente pelo Vite PWA plugin com:
- Nome e descrição do app
- Ícones em diferentes tamanhos
- Tema e cores
- Shortcuts para ações rápidas
- Configurações de display

### Service Worker
O service worker é gerado automaticamente e inclui:
- Cache de recursos estáticos
- Estratégias de cache personalizadas
- Atualização automática
- Notificações de eventos

### Armazenamento Offline
- LocalStorage para dados persistentes
- Fila de sincronização para ações offline
- Retry automático de operações falhadas
- Limpeza automática de dados antigos

## Compatibilidade

### Navegadores Suportados
- ✅ Chrome/Chromium 67+
- ✅ Firefox 79+
- ✅ Safari 15.4+
- ✅ Edge 79+

### Recursos por Plataforma
| Recurso | Desktop | Android | iOS |
|---------|---------|---------|-----|
| Instalação | ✅ | ✅ | ✅ |
| Offline | ✅ | ✅ | ✅ |
| Notificações | ✅ | ✅ | ⚠️* |
| Shortcuts | ✅ | ✅ | ❌ |

*iOS tem limitações nas notificações push

## Troubleshooting

### App não oferece instalação
- Verifique se está usando HTTPS ou localhost
- Confirme que o service worker está funcionando
- Aguarde alguns segundos após o carregamento

### Dados não sincronizam
- Verifique conexão com internet
- Acesse Configurações > PWA > Sincronizar Agora
- Limpe dados offline se necessário

### Notificações não funcionam
- Verifique permissões do navegador
- Teste com o botão na página de configurações
- Alguns navegadores bloqueiam notificações por padrão

## Desenvolvimento

Para adicionar novas funcionalidades PWA:

1. **Novos recursos offline**: Modifique `offlineManager.ts`
2. **Configurações PWA**: Edite `PWASettings.tsx`
3. **Notificações**: Use `PWAUtils.showNotification()`
4. **Ícones**: Execute `npm run generate-icons`

## Considerações de Performance

- Service worker é carregado de forma assíncrona
- Cache é otimizado para recursos críticos
- Sincronização acontece em background
- Dados offline são compactados quando possível
