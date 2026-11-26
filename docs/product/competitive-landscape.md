# Cenário competitivo e implicações para o roadmap

Data da análise: 26 de novembro de 2026.

Este documento registra referências de mercado e separa o que já existe no
SafeAnchor do que está **planejado**. Nada aqui deve ser lido como feature já
entregue. O objetivo é orientar priorização para apresentações e para o
roadmap, não prometer funcionalidade ausente.

## Como foi analisado

Busca pública em sites e páginas de produto das categorias:

- gestão de marinas e operação náutica;
- software para frotas e manutenção de embarcações;
- marketplaces e serviços náuticos;
- assistentes/IA aplicados a documentação e operação.

As páginas mudam com frequência; antes de usar qualquer afirmação externa em
material comercial, revisitá-las. Aqui ficam apenas os sinais estratégicos que
fazem sentido para o MVP atual.

## Referências observadas

| Referência | Sinal observado | O que o SafeAnchor já tem | Implicação |
|---|---|---|---|
| Docka (`docka.com`) | Gestão de marina, berços, reservas e operação do dia a dia. | Painel de marina, reservas e catálogo de serviços em demo. | Organizar a jornada da marina em filas de trabalho claras, não apenas telas. |
| AppBoats (`appboats.com`) | Plataforma para proprietários e prestadores, com foco em serviços e documentos. | Frota, manutenção, documentos, inspeções e prestadores em demo. | Manter o ciclo "documento → manutenção → prova de execução" conectado. |
| Gestão Náutica (`gestaonautica.com.br`) | Manutenção e conformidade como dor recorrente do proprietário. | Manutenções corretivas/preventivas e validade de documentos na API. | Alertas e prontidão operacional devem virar o resumo inicial do app. |
| Seahub (`seahub.io`) | Gestão de marinas e experiência do navegante. | Marinas, eventos, marketplace e comunidade em demo. | Evitar dispersão: marina é ponto de coordenação, não um segundo produto. |
| DeepBlue (`deepblue.ai` e produtos de IA náutica) | IA como apoio a decisão e automação de rotinas. | Telas de IA em modo demonstrativo. | Tornar explícito o que é mock; priorizar IA que explica dados já cadastrados. |
| YachtWave / Dockwa (`dockwa.com`) | Reserva, atracação e serviços integrados. | Reservas de marina e solicitações de serviço em demo. | Check-in/check-out e status de serviço são bons próximos passos. |
| Linear, Vercel, Stripe (fora do setor) | Produto rápido, bom onboarding, estados vazios claros, documentação e identidade consistente. | SPA com MVVM, CSS BEM, docs operacionais e assets de marca. | Cuidar da percepção de produto: favicon, SEO, copies e fluxo de consentimento também são produto. |

## Vantagens que o SafeAnchor já possui

1. **Fonte única de verdade para operação:** frota, manutenção, documentos e
   inspeções na mesma API real, com isolamento por `Party`.
2. **Demonstração executável:** contas reais e fluxo completo publicado, não
   apenas landing page.
3. **Arquitetura explicável:** MVVM no frontend e Route → Controller → Service →
   Prisma no backend, com documentação para humanos e agentes.
4. **Privacidade como decisão de produto:** sem rastreamento nem publicidade;
   captura de pesquisa depende de aceite explícito e pode ser recusada.
5. **Visão de ecossistema:** proprietário, prestador e marina no mesmo modelo,
   com marketplaces e comunidade em estágio de mock claramente sinalizado.

## Lacunas e plano competitivo

### P0 — necessário para a apresentação

| Item | Estado | Próxima ação |
|---|---|---|
| Consentimento explícito da pesquisa | Em implementação neste ciclo | Aviso com aceitar/recusar, captura condicionada e análise pela diretoria. |
| Papel `admin da diretoria` | Em implementação neste ciclo | Login de demo, autorização por role e tela de análise. |
| SEO e favicon | Implementado no ciclo | Validar no deploy os checks de assets, canonical, sitemap e robots. |

### P1 — diferentesiates realistas

1. **Prontidão operacional por embarcação.** Transformar documentos vencidos,
   manutenções atrasadas e inspeções incompletas em um único indicador com
   "próxima ação". Já há dados para isso.
2. **Alertas de validade e horímetro.** Hoje o sistema mostra vencimentos; o
   próximo passo é notificar proprietário e marina antes do risco.
3. **Portal do proprietário e do prestador.** Substituir telegramas e
   planilhas por um lugar onde o cliente acompanha status, aprova orçamento e
   recebe o relatório de serviço.
4. **Checklist offline-first.** Uso em marina e a bordo, com sincronização
   posterior e assinatura digital — evolui o que a API já faz.
5. **Upload de arquivos com metadados.** Hoje documentos são cadastrados com
   metadados e validade; o next step é armazenar o arquivo com URL assinada.
6. **Onboarding guiado por persona.** Primeiro login já deve mostrar os três
   passos que geram valor: cadastrar embarcação, criar manutenção, executar
   checklist.

### P2 — aposta controlada

1. **Status de caso e SLA de serviço** entre proprietário, marina e prestador.
2. **Resumo semanal automático** da frota, com riscos e ações pendentes.
3. **IA assistiva sobre dados do próprio usuário**, com citação das fontes e
   sempre com opção de não usar.
4. **Integração com calendário e clima** para planejamento de saídas.
5. **Marketplace transacional** com pagamento e reputação — apenas depois de
   validar demanda com a pesquisa e com os clientes demo.

## Regra de posicionamento

Não competir por "mais um marketplace náutico". Competir por **camada
operacional confiável**: o lugar onde a embarcação está pronta, o que falta e
quem precisa agir. Marketplace, comunidade, academy e IA apoiam essa promessa;
não a substituem.

## Fontes

- https://www.docka.com/
- https://www.appboats.com/
- https://gestaonautica.com.br/
- https://www.seahub.io/
- https://www.deepblue.ai/
- https://www.dockwa.com/
- https://linear.app/
- https://vercel.com/
- https://stripe.com/
