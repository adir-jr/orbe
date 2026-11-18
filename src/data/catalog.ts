import type { Category, Service, ServiceQuestion } from "@/domain/types";

/**
 * Catálogo inicial (Fase 1).
 *
 * Estes dados espelham as tabelas `categories` e `services` da migração
 * `supabase/migrations/0001_initial_schema.sql`. Na Fase 2, passam a vir do
 * banco e serão administrados pelo painel — nada aqui deve ser referenciado
 * diretamente pelas páginas: use `src/server/catalog.ts`.
 *
 * `isActive: false` mantém o item cadastrado, mas fora do site público.
 */

export const categories: Category[] = [
  {
    id: "cat-casa",
    slug: "casa-e-manutencao",
    name: "Casa e manutenção",
    description: "Reparos, instalações e pequenas obras para manter sua casa em ordem.",
    icon: "home",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "cat-limpeza",
    slug: "limpeza-e-conservacao",
    name: "Limpeza e conservação",
    description: "Limpeza do dia a dia, faxinas completas, pós-obra e cuidados com o jardim.",
    icon: "sparkles",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "cat-instalacao",
    slug: "instalacao-e-assistencia",
    name: "Instalação e assistência",
    description: "Instalação e manutenção de equipamentos, redes e sistemas de segurança.",
    icon: "wrench",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "cat-especializados",
    slug: "servicos-especializados",
    name: "Serviços especializados",
    description: "Trabalhos sob medida em metal, madeira e vidro.",
    icon: "hammer",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "cat-outros",
    slug: "outros-servicos",
    name: "Outros serviços",
    description: "Fotografia, design, serviços digitais e automotivos.",
    icon: "briefcase",
    sortOrder: 5,
    // Fora do piloto: será ativada quando houver demanda e profissionais.
    isActive: false,
  },
];

const scopeQuestion = (options: [string, string][]): ServiceQuestion => ({
  id: "scope",
  label: "Que tipo de serviço é?",
  type: "single_choice",
  required: true,
  options: options.map(([value, label]) => ({ value, label })),
});

const propertyQuestion: ServiceQuestion = {
  id: "property",
  label: "Qual é o tipo de imóvel?",
  type: "single_choice",
  required: false,
  options: [
    { value: "house", label: "Casa" },
    { value: "apartment", label: "Apartamento" },
    { value: "commercial", label: "Comercial" },
  ],
};

type ServiceSeed = Omit<Service, "id" | "isActive" | "questions"> & {
  questions?: ServiceQuestion[];
  isActive?: boolean;
};

const seeds: ServiceSeed[] = [
  // Casa e manutenção
  {
    slug: "eletricista",
    categorySlug: "casa-e-manutencao",
    name: "Eletricista",
    summary: "Instalação de tomadas, troca de disjuntores, chuveiros e identificação de falhas.",
    keywords: ["eletrica", "tomada", "disjuntor", "chuveiro", "fiacao", "luz", "lampada", "curto"],
    icon: "zap",
    questions: [
      scopeQuestion([
        ["installation", "Instalação de algo novo"],
        ["maintenance", "Manutenção ou troca"],
        ["fault", "Identificar e corrigir uma falha"],
      ]),
      propertyQuestion,
    ],
  },
  {
    slug: "encanador",
    categorySlug: "casa-e-manutencao",
    name: "Encanador",
    summary: "Vazamentos, desentupimentos, instalação de torneiras, registros e caixas d'água.",
    keywords: ["hidraulica", "vazamento", "cano", "desentupimento", "torneira", "registro", "caixa dagua"],
    icon: "droplet",
    questions: [
      scopeQuestion([
        ["leak", "Vazamento"],
        ["clog", "Entupimento"],
        ["installation", "Instalação ou troca de peças"],
      ]),
      propertyQuestion,
    ],
  },
  {
    slug: "pintor",
    categorySlug: "casa-e-manutencao",
    name: "Pintor",
    summary: "Pintura interna e externa, texturas, retoques e preparação de paredes.",
    keywords: ["pintura", "parede", "textura", "massa corrida", "tinta"],
    icon: "paintbrush",
    questions: [
      scopeQuestion([
        ["interior", "Ambientes internos"],
        ["exterior", "Fachada ou área externa"],
        ["both", "Interno e externo"],
      ]),
    ],
  },
  {
    slug: "pedreiro",
    categorySlug: "casa-e-manutencao",
    name: "Pedreiro",
    summary: "Pequenas obras, reformas, assentamento de pisos e reparos em alvenaria.",
    keywords: ["obra", "reforma", "piso", "alvenaria", "reboco", "azulejo", "construcao"],
    icon: "brick",
  },
  {
    slug: "montador-de-moveis",
    categorySlug: "casa-e-manutencao",
    name: "Montador de móveis",
    summary: "Montagem e desmontagem de móveis, instalação de prateleiras e painéis.",
    keywords: ["montagem", "movel", "guarda-roupa", "armario", "prateleira", "painel"],
    icon: "sofa",
  },
  {
    slug: "reparos-gerais",
    categorySlug: "casa-e-manutencao",
    name: "Reparos gerais",
    summary: "Aqueles pequenos consertos da casa: portas, fechaduras, suportes e ajustes.",
    keywords: ["marido de aluguel", "conserto", "fechadura", "porta", "suporte", "instalacao"],
    icon: "tool",
  },
  // Limpeza e conservação
  {
    slug: "diarista",
    categorySlug: "limpeza-e-conservacao",
    name: "Diarista",
    summary: "Limpeza e organização da casa por diária, de forma avulsa ou recorrente.",
    keywords: ["faxina", "limpeza", "faxineira", "diaria", "organizacao"],
    icon: "broom",
    questions: [
      {
        id: "frequency",
        label: "Com que frequência?",
        type: "single_choice",
        required: true,
        options: [
          { value: "once", label: "Uma vez" },
          { value: "weekly", label: "Toda semana" },
          { value: "biweekly", label: "A cada 15 dias" },
        ],
      },
      propertyQuestion,
    ],
  },
  {
    slug: "limpeza-residencial",
    categorySlug: "limpeza-e-conservacao",
    name: "Limpeza residencial",
    summary: "Limpeza completa de casas e apartamentos, incluindo mudanças.",
    keywords: ["faxina", "limpeza pesada", "mudanca", "apartamento"],
    icon: "sparkles",
  },
  {
    slug: "limpeza-pos-obra",
    categorySlug: "limpeza-e-conservacao",
    name: "Limpeza pós-obra",
    summary: "Remoção de resíduos de obra, poeira fina e limpeza técnica de acabamentos.",
    keywords: ["pos obra", "reforma", "entulho", "limpeza pesada"],
    icon: "building",
  },
  {
    slug: "jardinagem",
    categorySlug: "limpeza-e-conservacao",
    name: "Jardinagem",
    summary: "Corte de grama, poda, manutenção e montagem de jardins.",
    keywords: ["jardim", "grama", "poda", "paisagismo", "rocada"],
    icon: "leaf",
  },
  // Instalação e assistência
  {
    slug: "ar-condicionado",
    categorySlug: "instalacao-e-assistencia",
    name: "Ar-condicionado",
    summary: "Instalação, limpeza e manutenção de aparelhos de ar-condicionado.",
    keywords: ["split", "climatizacao", "higienizacao", "refrigeracao", "ar condicionado"],
    icon: "snowflake",
    questions: [
      scopeQuestion([
        ["installation", "Instalação"],
        ["cleaning", "Limpeza ou higienização"],
        ["repair", "Conserto"],
      ]),
    ],
  },
  {
    slug: "eletrodomesticos",
    categorySlug: "instalacao-e-assistencia",
    name: "Eletrodomésticos",
    summary: "Conserto e instalação de máquinas de lavar, geladeiras, fogões e outros.",
    keywords: ["maquina de lavar", "geladeira", "fogao", "conserto", "assistencia tecnica"],
    icon: "washing",
  },
  {
    slug: "redes-e-internet",
    categorySlug: "instalacao-e-assistencia",
    name: "Redes e internet",
    summary: "Configuração de roteadores, cabeamento e melhoria do sinal Wi‑Fi.",
    keywords: ["wifi", "roteador", "cabeamento", "rede", "internet"],
    icon: "wifi",
  },
  {
    slug: "cameras-de-seguranca",
    categorySlug: "instalacao-e-assistencia",
    name: "Câmeras de segurança",
    summary: "Instalação e configuração de câmeras, gravadores e acesso pelo celular.",
    keywords: ["cftv", "camera", "seguranca", "monitoramento", "alarme"],
    icon: "camera",
  },
  // Serviços especializados
  {
    slug: "soldador",
    categorySlug: "servicos-especializados",
    name: "Soldador",
    summary: "Solda em estruturas metálicas, portões, grades e reparos.",
    keywords: ["solda", "metal", "estrutura metalica"],
    icon: "flame",
  },
  {
    slug: "serralheiro",
    categorySlug: "servicos-especializados",
    name: "Serralheiro",
    summary: "Portões, grades, corrimãos e estruturas sob medida.",
    keywords: ["serralheria", "portao", "grade", "corrimao", "esquadria"],
    icon: "fence",
  },
  {
    slug: "marceneiro",
    categorySlug: "servicos-especializados",
    name: "Marceneiro",
    summary: "Móveis planejados e sob medida, reparos e ajustes em madeira.",
    keywords: ["marcenaria", "moveis planejados", "madeira", "sob medida"],
    icon: "ruler",
  },
  {
    slug: "vidraceiro",
    categorySlug: "servicos-especializados",
    name: "Vidraceiro",
    summary: "Box de banheiro, espelhos, janelas e troca de vidros.",
    keywords: ["vidracaria", "vidro", "box", "espelho", "janela"],
    icon: "window",
  },
  // Outros serviços (categoria inativa no piloto)
  {
    slug: "fotografia",
    categorySlug: "outros-servicos",
    name: "Fotografia",
    summary: "Ensaios, eventos e fotos de produtos.",
    keywords: ["fotografo", "ensaio", "evento"],
    icon: "aperture",
  },
  {
    slug: "design-grafico",
    categorySlug: "outros-servicos",
    name: "Design gráfico",
    summary: "Logotipos, identidade visual e materiais impressos.",
    keywords: ["designer", "logo", "arte"],
    icon: "pen",
  },
  {
    slug: "servicos-digitais",
    categorySlug: "outros-servicos",
    name: "Serviços digitais",
    summary: "Sites, redes sociais e suporte em informática.",
    keywords: ["site", "informatica", "computador", "redes sociais"],
    icon: "monitor",
  },
  {
    slug: "servicos-automotivos",
    categorySlug: "outros-servicos",
    name: "Serviços automotivos",
    summary: "Mecânica leve, elétrica automotiva e estética.",
    keywords: ["mecanico", "carro", "automovel", "lavacao"],
    icon: "car",
  },
];

export const services: Service[] = seeds.map((seed) => ({
  ...seed,
  id: `svc-${seed.slug}`,
  questions: seed.questions ?? [],
  isActive: seed.isActive ?? true,
}));

/** Serviços destacados na página inicial (alta recorrência de demanda). */
export const featuredServiceSlugs = [
  "eletricista",
  "diarista",
  "encanador",
  "montador-de-moveis",
  "ar-condicionado",
  "pintor",
];
