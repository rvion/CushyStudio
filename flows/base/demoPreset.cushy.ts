action('hello-kdc', {
    run: async (flow) => {
        // 🔴
        await flow.actions.basicImageGeneration({
            positive: `picture ofs a flower, masterpiece`,
            negative: '(worst quality:1.2), (low quality:1.2),',
            ckptName: 'ghostmix_v12.safetensors',
            steps: 10,
            batchSize: 1,
        })
        //
    },
})
