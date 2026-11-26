import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Icon from "../components/Icon";
import {
  CONSENT_CHANGED_EVENT,
  RESEARCH_CONSENT_VERSION,
  clearResearchConsent,
  markPrivacyNoticeSeen,
  readResearchConsent,
  saveResearchConsent,
} from "../services/researchConsent";
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

function ConsentControls() {
  const [consent, setConsent] = useState(() => readResearchConsent());

  useEffect(() => {
    const refresh = () => setConsent(readResearchConsent());
    window.addEventListener(CONSENT_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, refresh);
  }, []);

  function decide(decision) {
    saveResearchConsent(decision);
    markPrivacyNoticeSeen();
    setConsent(readResearchConsent());
  }

  function withdraw() {
    clearResearchConsent();
    setConsent(null);
  }

  return (
    <div className="legal__consent">
      <p>
        <strong>Sua escolha atual:</strong>{" "}
        {consent?.decision === "accepted"
          ? "captura autorizada"
          : consent?.decision === "declined"
            ? "captura recusada"
            : "ainda não respondida"}
        {consent?.answeredAt
          ? ` (em ${new Date(consent.answeredAt).toLocaleString("pt-BR")}, versão ${consent.version})`
          : ""}
        .
      </p>
      <div className="legal__consent-actions">
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={() => decide("accepted")}
        >
          Autorizar captura
        </button>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => decide("declined")}
        >
          Recusar captura
        </button>
        {consent && (
          <button type="button" className="btn btn--ghost btn--sm" onClick={withdraw}>
            Revogar escolha
          </button>
        )}
      </div>
      <p className="legal__consent-note">
        A revogação vale para respostas futuras. Para apagar respostas já
        capturadas, fale com o controlador pelo WhatsApp no fim desta página.
        Versão atual do consentimento: {RESEARCH_CONSENT_VERSION}.
      </p>
    </div>
  );
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
          <h2 className="legal__section-title">2. Captura da pesquisa e seu consentimento</h2>
          <p>
            Antes de responder à pesquisa, você escolhe explicitamente entre
            <strong> autorizar</strong> ou <strong>recusar</strong> a captura. A
            escolha fica registrada no seu navegador com data e versão da
            política; nenhum cookie de rastreamento ou publicidade é criado.
          </p>
          <ConsentControls />
          <p>
            Se você <strong>autorizar</strong>, o servidor emite um nonce
            assinado, com validade curta, e valida esse nonce no envio. Só assim
            as respostas, o perfil
            informado e, caso você deixe, nome, cidade e e-mail ou WhatsApp são
            gravados. O registro do consentimento inclui IP, user-agent, data e
            hora gerados no servidor, versão da política e identificador do
            nonce; a diretoria analisa os dados para priorizar mudanças no
            produto. Cada decisão sobre uma resposta ou sobre o papel de um
            usuário gera um registro mínimo de auditoria, sem senhas ou tokens.
          </p>
          <p>
            Se você <strong>recusar</strong>, pode responder todas as perguntas
            normalmente. Nada é enviado ao servidor nem gravado no banco: o
            resumo aparece apenas na sua tela e você pode copiá-lo ou enviá-lo
            manualmente por e-mail/WhatsApp.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">3. Quais dados coletamos</h2>
          <ul className="legal__list">
            <li>
              <strong>Pesquisa de produto:</strong> perfil, respostas e, se você
              quiser, nome, cidade e um meio de contato — somente após aceite.
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
              <strong>Dados técnicos de uso:</strong> identificador da
              requisição, horário e logs de erro. Tokens, senhas e cookies de
              autenticação são removidos dos logs.
            </li>
          </ul>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">4. Por que usamos os dados</h2>
          <ul className="legal__list">
            <li>
              entender o que construir primeiro a partir da pesquisa capturada
              com consentimento;
            </li>
            <li>autenticar você e manter sua sessão enquanto o token for válido;</li>
            <li>
              permitir o cadastro e o acompanhamento da frota, manutenções,
              documentos e inspeções;
            </li>
            <li>
              permitir que o administrador da diretoria ajuste papéis, personas
              e prioridades, com registro de auditoria;
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
          <h2 className="legal__section-title">5. Com quem compartilhamos</h2>
          <p>
            Os dados trafegam apenas pelos serviços necessários para executar a
            demonstração:
          </p>
          <ul className="legal__list">
            <li>
              <strong>Supabase</strong> — banco PostgreSQL onde ficam conta,
              frota, respostas consentidas e registros operacionais;
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
              automaticamente;
            </li>
            <li>
              <strong>Admin da diretoria</strong> — único perfil interno com
              acesso às respostas capturadas e às ferramentas de alteração.
            </li>
          </ul>
          <p>
            Não vendemos dados, não usamos dados pessoais para publicidade
            direcionada e não instalamos rastreadores de terceiros.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">6. Cookies e armazenamento local</h2>
          <p>
            Esta demonstração não usa cookies de rastreamento, analytics ou
            publicidade. Usamos o armazenamento local do navegador para funções
            essenciais e para lembrar sua escolha de consentimento.
            O token de acesso e o perfil da sessão ficam somente na memória da
            aba: não são gravados no navegador e desaparecem ao recarregar a
            página. Para continuar usando a área privada, entre novamente.
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
                  <td><code>safeanchor.research.draft</code></td>
                  <td>Restaurar o rascunho da pesquisa.</td>
                  <td>Até finalizar ou reiniciar a pesquisa.</td>
                </tr>
                <tr>
                  <td><code>safeanchor.researchResponses</code></td>
                  <td>Guardar cópia local do resumo quando você autoriza a captura.</td>
                  <td>Até você limpar os dados do site.</td>
                </tr>
                <tr>
                  <td><code>safeanchor.researchConsent</code></td>
                  <td>Registrar aceite ou recusa, com data e versão da política.</td>
                  <td>Até você revogar ou limpar os dados do site.</td>
                </tr>
                <tr>
                  <td><code>safeanchor.cookieConsent</code></td>
                  <td>Lembrar que você leu o aviso de privacidade.</td>
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
          <h2 className="legal__section-title">7. Segurança e retenção</h2>
          <p>
            Usamos HTTPS, senhas com hash, token JWT com validade de uma hora,
            isolamento de dados por proprietário/organização, acesso restrito por
            papel e remoção de segredos nos logs. Respostas capturadas e
            auditorias são mantidas enquanto necessárias para a demonstração ou
            até você solicitar a exclusão. Registros de segurança podem ser
            retidos por período limitado.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">8. Seus direitos</h2>
          <p>
            Nos termos do art. 18 da LGPD, você pode pedir: confirmação da
            existência dos dados, acesso, correção, anonimização, bloqueio ou
            eliminação, portabilidade, revogação do consentimento e informação
            sobre compartilhamentos. Para isso, fale com o controlador pelo
            WhatsApp acima. Responderemos no prazo legal.
          </p>
        </section>

        <section className="legal__section">
          <h2 className="legal__section-title">9. Mudanças nesta política</h2>
          <p>
            Esta página pode ser atualizada quando o produto mudar. A data da
            última revisão sempre aparece no início. Em mudanças relevantes, o
            aviso será atualizado no site e uma nova versão do consentimento
            será solicitada.
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
