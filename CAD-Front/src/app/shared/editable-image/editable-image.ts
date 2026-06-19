import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageEditService } from '../../core/services/image-edit.service';
import { AudIllustrationComponent, AudScene, AudTheme } from '../aud-illustration/aud-illustration';

@Component({
  selector: 'app-editable-image',
  standalone: true,
  imports: [CommonModule, AudIllustrationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './editable-image.html',
  styleUrl: './editable-image.css',
})
export class EditableImageComponent {
  protected svc = inject(ImageEditService);

  private _id = signal<string>('');
  private _src = signal<string>('');
  private _alt = signal<string>('');
  private _imgClass = signal<string>('');
  private _width = signal<number | undefined>(undefined);
  private _height = signal<number | undefined>(undefined);
  private _aspectLabel = signal<string | undefined>(undefined);
  private _eager = signal<boolean>(false);
  private _theme = signal<AudTheme>('cdj');
  private _scene = signal<AudScene>('hero');

  @Input({ required: true }) set id(v: string) { this._id.set(v); }
  @Input({ required: true }) set src(v: string) { this._src.set(v); }
  @Input() set alt(v: string) { this._alt.set(v); }
  @Input() set imgClass(v: string) { this._imgClass.set(v); }
  @Input() set width(v: number | undefined) { this._width.set(v); }
  @Input() set height(v: number | undefined) { this._height.set(v); }
  @Input() set aspectLabel(v: string | undefined) { this._aspectLabel.set(v); }
  @Input() set eager(v: boolean) { this._eager.set(v); }
  @Input() set theme(v: AudTheme) { this._theme.set(v); }
  @Input() set scene(v: AudScene) { this._scene.set(v); }

  imgFailed = signal(false);
 
  resolvedSrc = computed(() => this.svc.getOverride(this._id()) ?? this._src());
  hasOverride = computed(() => !!this.svc.getOverride(this._id()));
  isEditActive = this.svc.isEditActive;
  showFallback = computed(() => this.imgFailed() && !this.hasOverride());
 
  get displayId() { return this._id(); }
  get alt$() { return this._alt(); }
  get imgClass$() { return this._imgClass(); }
  get loadingAttr() { return this._eager() ? 'eager' : 'lazy'; }
  get widthLabel() {
    const w = this._width(), h = this._height();
    if (w && h) return `${w} × ${h}px`;
    return null;
  }
  get aspect() { return this._aspectLabel(); }
  get themeVal(): AudTheme { return this._theme(); }
  get sceneVal(): AudScene { return this._scene(); }
 
  onImgLoad() { this.imgFailed.set(false); }
  onImgError() { this.imgFailed.set(true); }
}
