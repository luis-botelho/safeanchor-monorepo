import { Link } from "react-router-dom";

import Icon from "../components/Icon";
import {
  buildWhatsappUrl,
  researchPhone,
} from "../services/researchService";

const privacyRequestUrl = buildWhatsappUrl(
  "Olá! Gostaria de exercer meus direitos de privacidade (LGPD).",
);

function displayPhone(phone) {
  if (phone.length !== 13) return phone || "(24) 99277-2357";
  return `+${phone[0]} (${phone.slice(1, 3)}) ${phone.slice(3, 7)}-${phone.slice(7)}`;
}

export default function PrivacyPage() {
  return (
    <div className="legal">
      <header className="legal__header">
        <Link to="/" className="legal__back">
          <Icon name="back" size={16} />
          Voltar para o início
        </Link>
        <span className="legal__brand">SafeAnchor</span>
      </header>

      <main className="legal__main">
        <p className="legal__eyebrow">Transparência e LGPD</p>
        <h1 className="legal__title">Política de Privacidade</h1>
        <p className="legal__lead">
          Esta política explica quais dados o SafeAnchor trata, por quê, com quem
          compartilha e como você pode exercer seus direitos previstos na Lei
          Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>
        <p className="legal__updated">Última atualização: 26 de novembro de 2026.</p>

        <section className="legal__section">
          <h2 className="legal__section-title">1. Quem é o controlador</h2>
          <p>
            O controlador dos dados é o <strong>SafeAnchor</strong>, projeto
            mantido por Luis Fellype Botelho. Para dúvidas ou para exercer seus
            direitos, use o WhatsApp de contato:{" "}
            <a href={privacyRequestUrl} target="_blank" rel="noopener noreferrer">
              {displayPhone(researchPhone)}
            </a>
            . Você também pode usar o canal de e-mail informado no formulário de
            pesquisa.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">2. Quais dados coletamos</h2>
          <ul className="legal__list">
            <li>
              <strong>Pesquisa de produto:</strong> perfil, respostas às perguntas
              e, se você quiser, nome, cidade e um meio de contato.
            </li>
            <li>
              <strong>Conta de acesso:</strong> nome, e-mail, hash da senha
              (bcrypt), papel e persona. A senha original nunca é armazenada.
            </li>
            <li>
              <strong>Dados operacionais que você cadastra:</strong> embarcações,
              manutenções, documentos (metadados e validade) e inspeções com
              checklist.
            </li>
            <li>
              <strong>Dados técnicos de uso:</strong> identificador da requisição,
              horário e logs de erro. Tokens, senhas e cookies de autenticação
              são removidos dos logs.
            </li>
          </ul>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">3. Por que usamos os dados</h2>
          <ul className="legal__list">
            <li>entender o que construir primeiro a partir da pesquisa;</li>
            <li>autenticar você e manter sua sessão enquanto o token for válido;</li>
            <li>
              permitir o cadastro e o acompanhamento da frota, manutenções,
              documentos e inspeções;
            </li>
            <li>proteger a API contra acessos indevidos e depurar falhas.</li>
          </ul>
          <p>
            As bases legais são o <strong>consentimento</strong> (pesquisa e
            contato), a <strong>execução de contrato</strong> (conta e recursos
            contratados) e o <strong>legítimo interesse</strong> (segurança e
            estabilidade do serviço).
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">4. Com quem compartilhamos</h2>
          <p>
            Os dados trafegam apenas pelos serviços necessários para executar a
            demonstração:
          </p>
          <ul className="legal__list">
            <li>
              <strong>Supabase</strong> — banco PostgreSQL onde ficam conta,
              frota e registros operacionais;
            </li>
            <li>
              <strong>Vercel</strong> — hospedagem da API e variáveis de ambiente;
            </li>
            <li>
              <strong>Resend</strong> — envio do resumo da pesquisa por e-mail;
            </li>
            <li>
              <strong>GitHub Pages</strong> — hospedagem da interface estática;
            </li>
            <li>
              <strong>WhatsApp</strong> — somente se você clicar no botão de
              contato; a conversa é aberta no seu aplicativo e não é enviada
              automaticamente.
            </li>
          </ul>
          <p>
            Não vendemos dados e não usamos dados pessoais para publicidade
            direcionada.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">
            5. Cookies e armazenamento local
          </h2>
          <p>
            Esta demonstração não usa cookies de rastreamento, analítica ou
            publicidade. Usamos o armazenamento local do navegador para funções
            essenciais:
          </p>
          <div className="legal__table-wrap">
            <table className="legal__table">
              <thead>
                <tr>
                  <th>Chave</th>
                  <th>Finalidade</th>
                  <th>Duração</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>token</code></td>
                  <td>Manter o JWT que autentica as chamadas à API.</td>
                  <td>Até expirar (1 hora) ou sair da conta.</td>
                </tr>
                <tr>
                  <td><code>safeanchor:session</code></td>
                  <td>Guardar o perfil exibido na interface.</td>
                  <td>Até sair da conta ou limpar o navegador.</td>
                </tr>
                <tr>
                  <td><code>safeanchor.research.draft</code></td>
                  <td>Restaurar o rascunho da pesquisa.</td>
                  <td>Até finalizar ou reiniciar a pesquisa.</td>
                </tr>
                <tr>
                  <td><code>safeanchor.researchResponses</code></td>
                  <td>Guardar uma cópia local do resumo enviado.</td>
                  <td>Até você limpar os dados do site.</td>
                </tr>
                <tr>
                  <td><code>safeanchor.cookieConsent</code></td>
                  <td>Lembrar que você leu este aviso.</td>
                  <td>Até você limpar os dados do site.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Você pode apagar tudo isso nas configurações do navegador. Sem o
            <code> token</code>, será preciso entrar novamente na demonstração.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">6. Segurança e retenção</h2>
          <p>
            Usamos HTTPS, senhas com hash, token JWT com validade de uma hora,
            isolamento de dados por proprietário/organização e remoção de
            segredos nos logs. Os dados são mantidos enquanto necessários à
            demonstração ou até você solicitar a exclusão. Registros de segurança
            podem ser retidos por período limitado.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">7. Seus direitos</h2>
          <p>
            Nos termos do art. 18 da LGPD, você pode pedir: confirmação da
            existência dos dados, acesso, correção, anonimização, bloqueio ou
            eliminação, portabilidade, revogação do consentimento e informação
            sobre compartilhamentos. Para isso, fale com o controlador pelo
            WhatsApp acima. Responderemos no prazo legal.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">8. Mudanças nesta política</h2>
          <p>
            Esta página pode ser atualizada quando o produto mudar. A data da
            última revisão sempre aparece no início. Em mudanças relevantes, o
            aviso será atualizado no site.
          </p>
        </section>

        <div className="legal__contact">
          <Icon name="whatsapp" size={22} />
          <div>
            <strong>Precisa de ajuda com seus dados?</strong>
            <p>
              <a
                href={privacyRequestUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Falar com o controlador pelo WhatsApp
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
