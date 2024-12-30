import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export function HelpDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 ml-2">
          Ajuda
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-[999]" />
        <Dialog.Content className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full max-w-2xl z-[1000]">
          <Dialog.Title className="text-2xl font-semibold mb-4">
            Como Utilizar o SANA+
          </Dialog.Title>
          
          <div className="space-y-4">
            <section>
              <h3 className="text-lg font-medium mb-2">Interação com o Paciente</h3>
              <p className="text-gray-600">
                Utilize o botão de microfone para iniciar uma conversa com o paciente. O sistema irá processar a fala natural e fornecer respostas apropriadas.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-2">Registo de Notas</h3>
              <p className="text-gray-600">
                Durante a conversa, pode registar observações importantes utilizando o painel de notas. Estas notas serão incluídas no relatório final.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-2">Análise de Comportamento</h3>
              <p className="text-gray-600">
                O sistema analisa automaticamente padrões de fala e comportamento, fornecendo insights sobre possíveis sinais de progressão do Alzheimer.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-medium mb-2">Relatórios</h3>
              <p className="text-gray-600">
                Após cada sessão, pode gerar um relatório detalhado que inclui todas as interações, notas e análises realizadas durante a conversa.
              </p>
            </section>

            <div className="mt-8 pt-4 border-t text-sm text-gray-500 text-center">
              Desenvolvido por Patrício Brito 2024
            </div>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </Dialog.Close>
          
          <div className="mt-6 flex justify-end">
            <Dialog.Close asChild>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
                Fechar
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
