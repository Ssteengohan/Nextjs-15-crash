import { defineField, defineType } from "sanity";
import { BunnyImageInput } from "../components/BunnyImageInput";

export const startup = defineType({
    name: 'startup',
    title: 'Startup',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            type: 'string',
        }),
        defineField({
            name: 'slug',
            type: 'slug',
            options: {
                source: 'title',
            }
        }),
        defineField({
            name: 'author',
            type: 'reference',
            to: { type: 'author' },
        }),
        defineField({
            name: 'views',
            type: 'number',
        }),
        defineField({
            name: 'description',
            type: 'text',
        }),
        defineField({
            name: 'category',
            type: 'string',
            validation: (Rule) => Rule.min(1).max(20).required().error("Please enter a category"),
        }),        
        defineField({
            name: 'image',
            type: 'string',
            title: 'Image',
            description: 'Upload an image to Bunny CDN',
            validation: (Rule) => Rule.required(),
            components: {
                input: BunnyImageInput,
            }
        }),
        defineField({
            name: 'pitch',
            type: 'markdown',
        }),
    ],
})