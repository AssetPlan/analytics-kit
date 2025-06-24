const consoleProvider = {
    track: function(event, properties = {}) {
        console.log('📊 Track:', event, properties);
    },
    
    identify: function(userId, traits = {}) {
        console.log('👤 Identify:', userId, traits);
    },
    
    page: function(name, properties = {}) {
        console.log('📄 Page:', name, properties);
    },
    
    reset: function() {
        console.log('🔄 Reset: User session cleared');
    },
    
    alias: function(newId, previousId) {
        console.log('🔗 Alias:', { newId, previousId });
    },
    
    ready: function(callback) {
        console.log('✅ Ready: Console provider initialized');
        if (typeof callback === 'function') {
            callback();
        }
    }
};

export default consoleProvider;