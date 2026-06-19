-- CreateEnum
CREATE TYPE "AudienceKey" AS ENUM ('kids', 'teens', 'families', 'teachers', 'help', 'edutips', 'casi', 'cdj');

-- CreateEnum
CREATE TYPE "IlloScene" AS ENUM ('hero', 'study', 'play', 'connect', 'shield', 'spark', 'compass');

-- CreateEnum
CREATE TYPE "ResourceFormat" AS ENUM ('video_animado', 'microsidio', 'audiocuento', 'guia', 'checklist', 'simulador', 'actividad', 'tarjeta_imprimible', 'secuencia_didactica', 'protocolo', 'infografia');

-- CreateEnum
CREATE TYPE "ResourceLevel" AS ENUM ('preescolar', 'primaria_baja', 'primaria_alta', 'secundaria', 'preparatoria', 'gestion_escolar', 'primera_infancia', 'ninez', 'adolescencia_temprana', 'adolescencia_tardia', 'todos');

-- CreateEnum
CREATE TYPE "ResourceTheme" AS ENUM ('seguridad_y_privacidad', 'convivencia_digital', 'bienestar_digital', 'pensamiento_critico', 'riesgos_y_enganos', 'uso_responsable', 'huella_e_identidad', 'ciberacoso');

-- CreateEnum
CREATE TYPE "ResourceContext" AS ENUM ('casa', 'aula', 'microsidio', 'todos');

-- CreateEnum
CREATE TYPE "BannerSlot" AS ENUM ('home_hero', 'home_secondary', 'audience_hero', 'audience_cta', 'edutips_hero', 'ayuda_hero', 'custom');

-- CreateEnum
CREATE TYPE "CardDestination" AS ENUM ('series', 'series_edutips', 'series_casi', 'series_familias', 'series_kids', 'series_teens', 'cursos', 'juegos', 'recursos', 'ayuda', 'edutips', 'notebooks_ia', 'ninas_y_ninos', 'adolescentes', 'familias', 'docentes', 'quienes_somos', 'inicio');

-- CreateEnum
CREATE TYPE "CourseLevel" AS ENUM ('basico', 'intermedio', 'avanzado');

-- CreateEnum
CREATE TYPE "GameKind" AS ENUM ('quiz', 'simulator', 'card_game', 'story', 'puzzle', 'arcade', 'embed', 'external');

-- CreateEnum
CREATE TYPE "AINotebookKind" AS ENUM ('notebooklm', 'gemini_gem', 'chatgpt_gpt', 'claude_project', 'other');

-- CreateTable
CREATE TABLE "SiteBranding" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "siteName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "logoLine1" TEXT NOT NULL,
    "logoLine2" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteBranding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeroBlock" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "eyebrow" TEXT,
    "titleLead" TEXT NOT NULL,
    "titleHighlight" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "primaryCtaLabel" TEXT NOT NULL,
    "primaryCtaHref" TEXT NOT NULL,
    "secondaryCtaLabel" TEXT,
    "secondaryCtaHref" TEXT,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pillar" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "bgClass" TEXT NOT NULL,
    "shadowClass" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Pillar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "hoverClass" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterColumn" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FooterColumn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FooterLink" (
    "id" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "FooterLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audience" (
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "audience" "AudienceKey" NOT NULL,
    "illoScene" "IlloScene",
    "ageRange" TEXT,
    "imageUrl" TEXT NOT NULL,
    "accentClass" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Audience_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "AudienceSubLevel" (
    "id" TEXT NOT NULL,
    "audienceSlug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "bgClass" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "level" "ResourceLevel",
    "resourceCount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AudienceSubLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudienceTopic" (
    "id" TEXT NOT NULL,
    "audienceSlug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bgClass" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AudienceTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureCard" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'play_arrow',
    "iconBgClass" TEXT NOT NULL DEFAULT 'bg-amber-600',
    "iconShadowClass" TEXT NOT NULL DEFAULT 'shadow-amber-200',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "destination" "CardDestination" NOT NULL DEFAULT 'series',
    "audience" "AudienceKey" NOT NULL DEFAULT 'cdj',
    "illoScene" "IlloScene",
    "badge" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sections" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "ctaLabel" TEXT,
    "ctaHref" TEXT,
    "audience" "AudienceKey",
    "slot" "BannerSlot" NOT NULL DEFAULT 'home_secondary',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VideoSeries" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "coverImageUrl" TEXT NOT NULL,
    "accentClass" TEXT NOT NULL,
    "iconBgClass" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "audience" "AudienceKey" NOT NULL,
    "illoScene" "IlloScene",
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "youtubePlaylistId" TEXT,
    "lastSyncedAt" TIMESTAMP(3),

    CONSTRAINT "VideoSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeUrl" TEXT NOT NULL,
    "durationLabel" TEXT,
    "publishedAt" TIMESTAMP(3),
    "tags" JSONB NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "format" "ResourceFormat" NOT NULL,
    "audienceSlug" TEXT NOT NULL,
    "level" "ResourceLevel",
    "theme" "ResourceTheme",
    "subtopic" TEXT,
    "context" "ResourceContext" NOT NULL DEFAULT 'todos',
    "durationMinutes" INTEGER,
    "youtubeUrl" TEXT,
    "mediaUrl" TEXT,
    "coverImageUrl" TEXT,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "learningOutcomes" JSONB NOT NULL DEFAULT '[]',
    "howToUse" JSONB NOT NULL DEFAULT '[]',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceDownload" (
    "id" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "fileType" TEXT,
    "sizeBytes" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ResourceDownload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceRelated" (
    "resourceId" TEXT NOT NULL,
    "relatedId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ResourceRelated_pkey" PRIMARY KEY ("resourceId","relatedId")
);

-- CreateTable
CREATE TABLE "HelpSituation" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "bgClass" TEXT NOT NULL,
    "whatToDoFirst" JSONB NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelpSituation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HelpChannel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "bgClass" TEXT NOT NULL,
    "contacts" JSONB NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelpChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audience" "AudienceKey" NOT NULL,
    "level" "ResourceLevel",
    "totalDurationMinutes" INTEGER,
    "outcomes" JSONB NOT NULL DEFAULT '[]',
    "coverImageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPathStep" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "intro" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LearningPathStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageOverride" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "format" TEXT,
    "sizeBytes" INTEGER,
    "uploadedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageOverride_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "longDescription" TEXT,
    "audience" "AudienceKey" NOT NULL,
    "level" "CourseLevel" NOT NULL DEFAULT 'basico',
    "durationHours" DOUBLE PRECISION,
    "instructor" TEXT,
    "syllabus" JSONB NOT NULL DEFAULT '[]',
    "materials" JSONB NOT NULL DEFAULT '[]',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "coverImageUrl" TEXT,
    "certificate" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'es',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audience" "AudienceKey" NOT NULL,
    "ageMin" INTEGER,
    "ageMax" INTEGER,
    "kind" "GameKind" NOT NULL DEFAULT 'embed',
    "embedUrl" TEXT,
    "externalUrl" TEXT,
    "coverImageUrl" TEXT,
    "badges" JSONB NOT NULL DEFAULT '[]',
    "learningGoals" JSONB NOT NULL DEFAULT '[]',
    "durationMinutes" INTEGER,
    "difficulty" INTEGER,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AINotebook" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audience" "AudienceKey" NOT NULL,
    "kind" "AINotebookKind" NOT NULL DEFAULT 'notebooklm',
    "externalUrl" TEXT NOT NULL,
    "topics" JSONB NOT NULL DEFAULT '[]',
    "instructions" TEXT,
    "prerequisites" TEXT,
    "coverImageUrl" TEXT,
    "language" TEXT NOT NULL DEFAULT 'es',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AINotebook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoSeries_slug_key" ON "VideoSeries"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Resource_slug_key" ON "Resource"("slug");

-- CreateIndex
CREATE INDEX "Resource_audienceSlug_idx" ON "Resource"("audienceSlug");

-- CreateIndex
CREATE INDEX "Resource_format_idx" ON "Resource"("format");

-- CreateIndex
CREATE INDEX "Resource_theme_idx" ON "Resource"("theme");

-- CreateIndex
CREATE UNIQUE INDEX "HelpSituation_slug_key" ON "HelpSituation"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPathStep_pathId_resourceId_key" ON "LearningPathStep"("pathId", "resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Game_slug_key" ON "Game"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AINotebook_slug_key" ON "AINotebook"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- AddForeignKey
ALTER TABLE "FooterLink" ADD CONSTRAINT "FooterLink_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "FooterColumn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudienceSubLevel" ADD CONSTRAINT "AudienceSubLevel_audienceSlug_fkey" FOREIGN KEY ("audienceSlug") REFERENCES "Audience"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudienceTopic" ADD CONSTRAINT "AudienceTopic_audienceSlug_fkey" FOREIGN KEY ("audienceSlug") REFERENCES "Audience"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "VideoSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_audienceSlug_fkey" FOREIGN KEY ("audienceSlug") REFERENCES "Audience"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceDownload" ADD CONSTRAINT "ResourceDownload_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceRelated" ADD CONSTRAINT "ResourceRelated_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceRelated" ADD CONSTRAINT "ResourceRelated_relatedId_fkey" FOREIGN KEY ("relatedId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathStep" ADD CONSTRAINT "LearningPathStep_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPathStep" ADD CONSTRAINT "LearningPathStep_resourceId_fkey" FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
