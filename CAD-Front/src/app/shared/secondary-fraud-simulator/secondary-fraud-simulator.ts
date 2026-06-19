import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SECONDARY_FRAUD_SIMULATOR_DATA,
  SimulatorCase,
  SimulatorChoice,
  SimulatorChoiceType,
} from '../../core/data/secondary-fraud-simulator.data';

interface ResultState {
  tone: 'solid' | 'medium' | 'risk';
  title: string;
  description: string;
  message: string;
  checklist: string[];
}

@Component({
  selector: 'app-secondary-fraud-simulator',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './secondary-fraud-simulator.html',
  styleUrl: './secondary-fraud-simulator.css',
})
export class SecondaryFraudSimulatorComponent {
  readonly data = SECONDARY_FRAUD_SIMULATOR_DATA;
  readonly cases = this.data.cases;
  readonly totalSteps = this.cases.reduce((sum, item) => sum + item.steps.length, 0);
  readonly maxSafeScore = this.cases.reduce(
    (sum, item) => sum + item.steps.reduce((stepSum, step) => stepSum + Math.max(...step.choices.map((choice) => choice.safe)), 0),
    0,
  );

  readonly started = signal(false);
  readonly finished = signal(false);
  readonly currentCaseIndex = signal(0);
  readonly currentStepIndex = signal(0);
  readonly copied = signal(false);
  readonly selections = signal<number[][]>(this.createEmptySelections());

  readonly currentCase = computed(() => this.cases[this.currentCaseIndex()]);
  readonly currentStep = computed(() => this.currentCase().steps[this.currentStepIndex()]);
  readonly selectedChoiceIndex = computed(() => this.selections()[this.currentCaseIndex()]?.[this.currentStepIndex()] ?? null);
  readonly selectedChoice = computed<SimulatorChoice | null>(() => {
    const choiceIndex = this.selectedChoiceIndex();
    return choiceIndex === null ? null : this.currentStep().choices[choiceIndex] ?? null;
  });

  readonly answeredSteps = computed(() => this.selections().reduce((sum, values) => sum + values.filter((value) => value !== undefined).length, 0));
  readonly progressPercent = computed(() => Math.round((this.answeredSteps() / this.totalSteps) * 100));
  readonly totalSafeScore = computed(() => this.sumAll('safe'));
  readonly totalRiskScore = computed(() => this.sumAll('risk'));
  readonly currentCaseSafeScore = computed(() => this.sumCase(this.currentCaseIndex(), 'safe'));
  readonly currentCaseRiskScore = computed(() => this.sumCase(this.currentCaseIndex(), 'risk'));

  readonly currentCaseSummary = computed(() => {
    const current = this.currentCase();
    const currentMax = current.steps.reduce((sum, step) => sum + Math.max(...step.choices.map((choice) => choice.safe)), 0);
    return this.currentCaseSafeScore() >= Math.ceil(currentMax * 0.7)
      ? current.successText
      : current.failText;
  });

  readonly result = computed<ResultState>(() => {
    const safe = this.totalSafeScore();
    const risk = this.totalRiskScore();

    if (safe >= 38 && risk <= 4) {
      return {
        tone: 'solid',
        title: 'Tienes buen radar digital',
        description: 'Identificaste presión, ligas falsas y peticiones de datos antes de tocar el enlace.',
        message:
          'Si un mensaje me mete presión para pagar o compartir datos, no entro a la liga. Yo verifico en el sitio oficial y, si huele raro, bloqueo y reporto.',
        checklist: [
          'No abrir ligas que llegan por mensaje, aunque parezcan oficiales.',
          'Verificar siempre en la app o dominio oficial.',
          'Reportar y bloquear cuando el mensaje pide datos o pago urgente.',
          'Explicar la regla a tu familia con un ejemplo simple.',
        ],
      };
    }

    if (safe >= 26 && risk <= 10) {
      return {
        tone: 'medium',
        title: 'Vas bien, pero aún te pueden empujar con urgencia',
        description: 'Reconoces varias señales, pero los mensajes con presión o datos reales todavía pueden confundirte.',
        message:
          'Antes de creerle a un mensaje, hago una pausa: no pago, no comparto datos y yo mismo busco el sitio o la app oficial para comprobar.',
        checklist: [
          'Hacer pausa cuando el mensaje diga “último aviso” o “solo hoy”.',
          'Comprobar dominios oficiales antes de actuar.',
          'Nunca dar CURP, INE, tarjeta o contraseñas por chat.',
          'Guardar captura antes de borrar para poder reportar.',
        ],
      };
    }

    return {
      tone: 'risk',
      title: 'Necesitas frenar antes de tocar la liga',
      description: 'La urgencia, los premios o los pagos pequeños todavía te están jalando hacia decisiones de riesgo.',
      message:
        'Aunque parezca premio, beca o paquete real, no doy datos ni pago desde un mensaje. Primero verifico en el canal oficial; si no coincide, bloqueo y reporto.',
      checklist: [
        'No pagar “ajustes” ni premios desde SMS o WhatsApp.',
        'No compartir documentos ni datos bancarios por chat.',
        'Preguntar a una persona adulta o a la escuela si el caso involucra becas o apoyos.',
        'Usar el 088 y el reporte de la app para cortar la cadena del fraude.',
      ],
    };
  });

  start(): void {
    this.started.set(true);
    this.finished.set(false);
    this.copied.set(false);
  }

  restart(): void {
    this.started.set(true);
    this.finished.set(false);
    this.currentCaseIndex.set(0);
    this.currentStepIndex.set(0);
    this.selections.set(this.createEmptySelections());
    this.copied.set(false);
  }

  readonly isTyping = signal(false);

  choose(choiceIndex: number): void {
    if (this.selectedChoiceIndex() !== null || this.finished() || this.isTyping()) return;

    this.isTyping.set(true);
    setTimeout(() => {
      this.isTyping.set(false);
      const next = this.selections().map((caseSelections) => [...caseSelections]);
      next[this.currentCaseIndex()][this.currentStepIndex()] = choiceIndex;
      this.selections.set(next);
    }, 1000);
  }

  continueFlow(): void {
    if (this.selectedChoiceIndex() === null) return;

    const caseIndex = this.currentCaseIndex();
    const stepIndex = this.currentStepIndex();
    const caseIsDone = stepIndex === this.currentCase().steps.length - 1;
    const simulatorIsDone = caseIsDone && caseIndex === this.cases.length - 1;

    if (simulatorIsDone) {
      this.finished.set(true);
      return;
    }

    if (caseIsDone) {
      this.currentCaseIndex.set(caseIndex + 1);
      this.currentStepIndex.set(0);
      return;
    }

    this.currentStepIndex.set(stepIndex + 1);
  }

  avatarLabel(avatar: SimulatorCase['steps'][number]['avatar']): string {
    if (avatar === 'brand-app') return 'WA';
    if (avatar === 'brand-shipping') return 'PK';
    if (avatar === 'brand-gov') return 'MX';
    return 'TÚ';
  }

  choiceTone(type: SimulatorChoiceType): string {
    if (type === 'good') return 'Seguro';
    if (type === 'warn') return 'Parcial';
    return 'Riesgo';
  }

  caseState(index: number): 'done' | 'active' | 'locked' {
    if (index < this.currentCaseIndex() || this.finished()) return 'done';
    if (index === this.currentCaseIndex()) return 'active';
    return 'locked';
  }

  async copyMessage(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.result().message);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1600);
    } catch {
      this.copied.set(false);
    }
  }

  private createEmptySelections(): number[][] {
    return this.cases.map(() => []);
  }

  private sumAll(metric: 'safe' | 'risk'): number {
    return this.selections().reduce((sum, caseSelections, caseIndex) => {
      return sum + caseSelections.reduce((caseSum, choiceIndex, stepIndex) => {
        if (choiceIndex === undefined) return caseSum;
        return caseSum + this.cases[caseIndex].steps[stepIndex].choices[choiceIndex][metric];
      }, 0);
    }, 0);
  }

  private sumCase(caseIndex: number, metric: 'safe' | 'risk'): number {
    return this.selections()[caseIndex].reduce((sum, choiceIndex, stepIndex) => {
      if (choiceIndex === undefined) return sum;
      return sum + this.cases[caseIndex].steps[stepIndex].choices[choiceIndex][metric];
    }, 0);
  }
}
