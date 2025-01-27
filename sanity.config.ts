'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schemaTypes} from './sanity/schemaTypes'
import {structure} from './sanity/structure'
import {markdownSchema} from 'sanity-plugin-markdown';

export default defineConfig({
  name: 'default',
  title: 'Your Project Name',
  projectId: 'your-project-id',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool({structure}),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    markdownSchema()
  ],
  schema: {
    types: schemaTypes,
  },
})
